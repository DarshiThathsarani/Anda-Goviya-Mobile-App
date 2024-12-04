import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DistrictsEnum from "../../ENUMS/DistrictEnum";

function CreateFarmerAdForm({ isVisible, onClose, onSubmit, userId }) {
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [district, setDistrict] = useState("");

  const submitAdHandler = () => {
    const adData = {
      title: adTitle,
      description: adDescription,
      district: district,
    };

    onSubmit(userId, adData);
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Create a New Ad</Text>

        <Text style={styles.label}>Ad Title</Text>
        <TextInput
          placeholder="Enter your ad title"
          value={adTitle}
          onChangeText={setAdTitle}
          style={styles.input}
          placeholderTextColor="#6c757d" // Placeholder color
        />

        <Text style={styles.label}>Ad Description</Text>
        <TextInput
          placeholder="Enter ad description"
          value={adDescription}
          onChangeText={setAdDescription}
          style={styles.textArea}
          multiline
          placeholderTextColor="#6c757d" // Placeholder color
        />

        <Text style={styles.label}>Select District</Text>
        <Picker
          selectedValue={district}
          style={styles.picker}
          onValueChange={(itemValue) => setDistrict(itemValue)}
        >
          <Picker.Item label="Select District" value="" />
          {Object.values(DistrictsEnum).map((districtName) => (
            <Picker.Item
              key={districtName}
              label={districtName}
              value={districtName}
            />
          ))}
        </Picker>

        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={submitAdHandler}>
            <Text style={styles.buttonText}>Submit Ad</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 60,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#495057", // Color for labels
    marginBottom: 5,
    alignSelf: "flex-start", // Align label to the start
  },
  input: {
    width: "100%",
    padding: 15,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    elevation: 1,
  },
  textArea: {
    width: "100%",
    padding: 15,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    height: 100,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    margin: 20,
    marginTop: 200,
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    padding: 10,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
});

export default CreateFarmerAdForm;
