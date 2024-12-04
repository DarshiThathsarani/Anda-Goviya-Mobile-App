// CreateAdForm.js
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DistrictsEnum from "../../ENUMS/DistrictEnum";

function CreateAdForm({ isVisible, onClose, onSubmit, userId }) {
  const [adTitle, setAdTitle] = useState("");
  const [landSize, setLandSize] = useState("");
  const [landType, setLandType] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [district, setDistrict] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const pickImageHandler = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setSelectedImages((prevImages) => [...prevImages, result.assets[0].uri]);
    }
  };

  const submitAdHandler = () => {
    const adData = {
      title: adTitle,
      size: landSize,
      type: landType,
      description: adDescription,
      images: selectedImages,
      district: district,
    };

    onSubmit(userId, adData);
    onClose();
  };

  const handleDistrictInputChange = (input) => {
    setDistrict(input);
    const filteredDistricts = Object.values(DistrictsEnum).filter((d) =>
      d.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filteredDistricts);
  };

  const selectDistrict = (district) => {
    setDistrict(district);
    setSuggestions([]);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Create a New Ad</Text>

            {/* Ad Title Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ad Title</Text>
              <TextInput
                placeholder="Enter ad title"
                value={adTitle}
                onChangeText={setAdTitle}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Land Size (Acres)</Text>
              <TextInput
                placeholder="Enter land size"
                value={landSize}
                onChangeText={setLandSize}
                style={styles.input}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Land Type</Text>
              <TextInput
                placeholder="Enter land type"
                value={landType}
                onChangeText={setLandType}
                style={styles.input}
              />
            </View>

            {/* Ad Description Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Ad Description</Text>
              <TextInput
                placeholder="Describe your ad"
                value={adDescription}
                onChangeText={setAdDescription}
                style={[styles.input, styles.textArea]}
                multiline
              />
            </View>

            {/* Image Picker Button */}
            <TouchableOpacity
              style={styles.imagePicker}
              onPress={pickImageHandler}
            >
              <Text style={styles.imagePickerText}>Pick an Image</Text>
            </TouchableOpacity>

            {/* Image Preview */}
            <ScrollView horizontal>
              {selectedImages.map((imageUri, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUri }}
                  style={styles.imagePreview}
                />
              ))}
            </ScrollView>

            {/* District Input with Suggestions */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>District</Text>
              <TextInput
                style={styles.input}
                placeholder="Start typing district"
                value={district}
                onChangeText={handleDistrictInputChange}
              />
              {suggestions.length > 0 && (
                <FlatList
                  data={suggestions}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => selectDistrict(item)}>
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.suggestionsContainer}
                />
              )}
            </View>

            {/* Modal Action Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={submitAdHandler}>
                <Text style={styles.buttonText}>Submit Ad</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 60,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#343a40",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#495057",
    marginBottom: 5,
  },
  input: {
    padding: 12,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    maxHeight: 150,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    margin: 20,
    marginTop: 30,
  },
  button: {
    backgroundColor: "#709627",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 16,
  },
  imagePicker: {
    backgroundColor: "#e9ecef",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  imagePickerText: {
    color: "#709627",
    fontWeight: "500",
    fontSize: 16,
  },
  suggestionsContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    maxHeight: 150,
  },
  suggestionText: {
    padding: 10,
    fontSize: 16,
    color: "#495057",
  },
});

export default CreateAdForm;
