import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importing MaterialIcons for chat icon

const AdPopup = ({ ad, isVisible, onClose, onChatPress }) => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const storage = getStorage();
      const imageRefs = ad.images || [];

      const urls = await Promise.all(
        imageRefs.map(async (imageRef) => {
          const storageRef = ref(storage, imageRef); // Fetch each image from Firebase Storage
          return await getDownloadURL(storageRef);
        })
      );
      setImageUrls(urls);
    };

    if (ad && ad.images) {
      fetchImages();
    }
  }, [ad]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalView}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {imageUrls.map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={styles.imagePreview}
            />
          ))}
        </ScrollView>

        {/* Text Container positioned directly beneath the image scroll */}
        <View style={styles.textContainer}>
          <Text style={styles.modalTitle}>{ad.title}</Text>
          <Text style={styles.modalDescription}>
            Description: {ad.description}
          </Text>
          <Text style={styles.locationText}>Location: {ad.district}</Text>
          <Text style={styles.locationText}>Size: {ad.size}</Text>
          <Text style={styles.locationText}>Type: {ad.type}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {
              onChatPress();
              onClose();
            }}
          >
            <Icon name="chat" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 60,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  locationText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  imageScroll: {
    margin: 0,
    padding: 0,
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: -5,
    verticalAlign: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderTop: 100,
  },
  chatButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 25,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AdPopup;
