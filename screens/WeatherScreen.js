import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import the icon component

const WeatherScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("Colombo"); // Default location
  const [inputLocation, setInputLocation] = useState("");

  const API_KEY = "fff33fe0bbf84b5ba66165527242110"; // Replace with your WeatherAPI key

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3`
      );
      setWeatherData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching weather data");
      setLoading(false);
    }
  };

  const handleLocationSearch = () => {
    if (inputLocation.trim()) {
      setLocation(inputLocation);
      setInputLocation("");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderForecastItem = ({ item }) => (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastDay}>{item.date}</Text>
      <Image
        style={styles.weatherIconSmall}
        source={{ uri: `https:${item.day.condition.icon}` }}
      />
      <Text style={styles.forecastTemp}>{item.day.avgtemp_c}°C</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Location and search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter location"
          value={inputLocation}
          onChangeText={setInputLocation}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleLocationSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Main weather display */}
      <Text style={styles.locationText}>
        {weatherData.location.name}, {weatherData.location.country}
      </Text>
      <Text style={styles.tempText}>{weatherData.current.temp_c}°C</Text>
      <Image
        style={styles.weatherIconLarge}
        source={{ uri: `https:${weatherData.current.condition.icon}` }}
      />
      <Text style={styles.conditionText}>
        {weatherData.current.condition.text}
      </Text>

      {/* Additional weather details with icons */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Icon name="weather-windy" size={30} color="#333" />
          <Text style={styles.detailsText}>
            {weatherData.current.wind_kph} km/h
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="water-percent" size={30} color="#333" />
          <Text style={styles.detailsText}>
            {weatherData.current.humidity}%
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Icon name="weather-sunset-up" size={30} color="#333" />
          <Text style={styles.detailsText}>
            {weatherData.forecast.forecastday[0].astro.sunrise}
          </Text>
        </View>
      </View>

      {/* 3-Day Forecast */}
      <FlatList
        data={weatherData.forecast.forecastday}
        renderItem={renderForecastItem}
        keyExtractor={(item) => item.date}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastListContent} // Use contentContainerStyle instead of style
        style={styles.forecastList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 30,
    width: "100%",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
    color: "#333",
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  searchButtonText: {
    color: "#333",
    fontSize: 16,
  },
  locationText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Dark text for location
  },
  tempText: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#333", // Dark text for temperature
    marginTop: -10,
    marginBottom: 40,
  },
  conditionText: {
    fontSize: 20,
    color: "#555", // Slightly lighter color for condition text
  },
  weatherIconLarge: {
    width: 150,
    height: 150,
    marginTop: -30,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  detailItem: {
    alignItems: "center",
  },
  detailsText: {
    fontSize: 16,
    color: "#333", // Dark text for details
    marginTop: 5,
  },
  forecastList: {
    marginTop: 40,
    marginBottom: 40,
  },
  forecastListContent: {
    alignItems: "center",
  },
  forecastItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Light background for forecast items
    borderRadius: 15,
    marginHorizontal: 10,
  },
  forecastDay: {
    color: "#333", // Dark text for forecast days
    fontSize: 16,
  },
  weatherIconSmall: {
    width: 50,
    height: 50,
  },
  forecastTemp: {
    color: "#333", // Dark text for forecast temperature
    fontSize: 20,
    marginTop: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
});

export default WeatherScreen;
