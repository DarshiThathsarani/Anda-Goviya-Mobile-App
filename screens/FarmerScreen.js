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
import { FAB } from "react-native-paper";
import CreateFarmerAdForm from "../components/ui/CreateFarmerAdModal";
import AdCard from "../components/ui/AdCard";
import AdPopup from "../components/ui/AdPopup";
import { database } from "../util/firebase-config";
import { ref, push, set, onValue } from "firebase/database";
import { Colors } from "../constants/styles";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Assuming you're using vector icons

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
  const adsRef = ref(database, "landads");
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

const submitAdHandler = async (userId, adData) => {
  try {
    const adRef = ref(database, "farmerads");
    const newAdRef = push(adRef);
    await set(newAdRef, {
      ...adData,
      userId,
      adId: newAdRef.key,
      createdAt: new Date().toISOString(),
    });
    console.log("Ad successfully submitted:", adData);
  } catch (error) {
    console.error("Error submitting ad:", error);
  }
};

function FarmerScreen() {
  const navigation = useNavigation();
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdModalVisible, setIsAdModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [districtQuery, setDistrictQuery] = useState("");
  const [suggestedDistricts, setSuggestedDistricts] = useState(districts);

  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId;

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

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const openAdModal = (ad) => {
    setSelectedAd(ad);
    setIsAdModalVisible(true);
  };

  const closeAdModal = () => {
    setSelectedAd(null);
    setIsAdModalVisible(false);
  };

  const startChatWithAdOwner = async (ad) => {
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
        <Text style={styles.headerTitle}>Land Ads</Text>

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
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

          {selectedAd && (
            <AdPopup
              ad={selectedAd}
              isVisible={isAdModalVisible}
              onClose={closeAdModal}
              onChatPress={() => startChatWithAdOwner(selectedAd)}
            />
          )}
        </ScrollView>
      </View>
      <FAB style={styles.fab} icon="plus" color="white" onPress={openModal} />
      <CreateFarmerAdForm
        isVisible={isModalVisible}
        onClose={closeModal}
        onSubmit={submitAdHandler}
        userId={userId}
        database={database}
      />
    </>
  );
}

export default FarmerScreen;

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
    elevation: 2, // Add shadow effect
  },
  searchIcon: {
    marginRight: 10,
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
    // marginTop: 200,
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
