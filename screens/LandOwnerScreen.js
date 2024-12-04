import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../store/auth-context";
import CreateAdForm from "../components/ui/CreateAdModal";
import { FAB } from "react-native-paper";
import AdCard from "../components/ui/AdCard";
import AdPopup from "../components/ui/AdPopup";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../constants/styles";
import { database } from "../util/firebase-config";
import { getDatabase, ref, push, set, onValue } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const districts = [
  "All",
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

const fetchAllAdsRealTime = (setAds) => {
  const adsRef = ref(database, "farmerads");
  onValue(adsRef, (snapshot) => {
    const ads = snapshot.val();
    if (ads) {
      const adsArray = Object.keys(ads).map((key) => ({
        id: key,
        ...ads[key],
      }));
      setAds(adsArray);
    } else {
      setAds([]);
    }
  });
};

function LandOwnerScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isAdModalVisible, setIsAdModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [districtQuery, setDistrictQuery] = useState("");
  const [suggestedDistricts, setSuggestedDistricts] = useState(districts);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId;
  const navigation = useNavigation();

  const submitAdHandler = async (userId, adData) => {
    try {
      const storage = getStorage();

      const uploadedImageUrls = await Promise.all(
        adData.images.map(async (imageUri, index) => {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const imageRef = storageRef(
            storage,
            `landads/${userId}/${Date.now()}_${index}.jpg`
          );
          await uploadBytes(imageRef, blob);
          return await getDownloadURL(imageRef);
        })
      );

      const updatedAdData = {
        ...adData,
        images: uploadedImageUrls,
      };

      const adRef = ref(database, "landads");
      const newAdRef = push(adRef);

      await set(newAdRef, {
        ...updatedAdData,
        userId,
        adId: newAdRef.key,
        createdAt: new Date().toISOString(),
      });

      console.log("Ad successfully submitted:", adData);
    } catch (error) {
      console.error("Error submitting ad:", error);
    }
  };

  useEffect(() => {
    fetchAllAdsRealTime(setAds);
  }, []);

  useEffect(() => {
    let filtered = ads;

    if (searchQuery) {
      filtered = filtered.filter(
        (ad) =>
          ad.title && ad.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (districtQuery && districtQuery !== "All") {
      filtered = filtered.filter(
        (ad) =>
          ad.district &&
          ad.district.toLowerCase() === districtQuery.toLowerCase()
      );
    }

    setFilteredAds(filtered);
  }, [searchQuery, districtQuery, ads]);

  const openAdModal = (ad) => {
    setSelectedAd(ad);
    setIsAdModalVisible(true);
  };

  const closeAdModal = () => {
    setSelectedAd(null);
    setIsAdModalVisible(false);
  };

  const startChatWithFarmer = (ad) => {
    const item = { id: ad.userId, name: ad.userName };
    navigation.navigate("ChatRoom", { item });
  };

  const handleDistrictChange = (text) => {
    setDistrictQuery(text);
    if (text) {
      const filteredDistricts = districts.filter((district) =>
        district.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestedDistricts(filteredDistricts);
    } else {
      setSuggestedDistricts(districts);
    }
  };

  const selectDistrict = (district) => {
    setDistrictQuery(district);
    setSuggestedDistricts([]);
  };

  return (
    <>
      <View style={styles.rootContainer}>
        <Text style={styles.headerTitle}>Farmer Ads</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search by title"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search by district"
            value={districtQuery}
            onChangeText={(text) => handleDistrictChange(text)}
          />
        </View>

        {suggestedDistricts.length > 0 && (
          <ScrollView style={styles.suggestionsContainer}>
            {suggestedDistricts.map((district) => (
              <TouchableOpacity
                key={district}
                onPress={() => selectDistrict(district)}
              >
                <Text style={styles.suggestionText}>{district}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <ScrollView contentContainerStyle={styles.scrollView}>
          {filteredAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} onPress={openAdModal} />
          ))}
        </ScrollView>

        {selectedAd && (
          <AdPopup
            ad={selectedAd}
            isVisible={isAdModalVisible}
            onClose={closeAdModal}
            onChatPress={() => startChatWithFarmer(selectedAd)}
          />
        )}
      </View>
      <FAB style={styles.fab} icon="plus" color="white" onPress={openModal} />
      <CreateAdForm
        isVisible={isModalVisible}
        onClose={closeModal}
        onSubmit={submitAdHandler}
        userId={userId}
        database={database}
      />
    </>
  );
}

export default LandOwnerScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "black",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 20,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderWidth: 0,
    paddingHorizontal: 10,
  },
  suggestionsContainer: {
    maxHeight: 250,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 2,
  },
  suggestionText: {
    paddingVertical: 8,
    color: "black",
  },
  scrollView: {
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary500,
    elevation: 5,
  },
});
