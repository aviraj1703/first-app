import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../Shared/Colors";
import { GOOGLE_MAPS_API_KEY } from "@env";

export default function PlaceItem({ place }) {
  return (
    <View style={styles.container}>
      {place?.photos ? (
        <Image
          source={{
            uri:
              "https://maps.googleapis.com/maps/api/place/photo" +
              "?maxwidth=400" +
              "&photo_reference=" +
              place?.photos[0]?.photo_reference +
              "&key=" +
              GOOGLE_MAPS_API_KEY,
          }}
          style={styles.photo}
        />
      ) : (
        <Image
          source={require("../../../assets/Categories/null.png")}
          style={styles.photo}
        />
      )}
      <View style={styles.details}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.address}>{place.vicinity}</Text>
        <View style={styles.rating}>
          {place.rating !== undefined ? (
            <Text style={styles.ratingDetails}>{place.rating}</Text>
          ) : (
            <Text style={styles.ratingDetails}>0</Text>
          )}
          <MaterialCommunityIcons
            name="star"
            size={13}
            color={Colors.grey}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "fit-content",
    marginVertical: "2%",
    padding: "2%",
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.placeDetail,
    borderRadius: 20,
    elevation: 1,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: "2%",
    borderRadius: 15,
  },
  details: {
    width: "65%",
    height: "fit-content",
  },
  name: {
    fontSize: 17,
    fontFamily: "Overlock-Bold",
    margin: "1%",
  },
  address: {
    fontSize: 13,
    fontFamily: "Overlock-Regular",
    color: Colors.grey,
    margin: "1%",
  },
  rating: {
    marginTop: "1%",
    width: 50,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: Colors.cornsilk,
    borderRadius: 5,
    elevation: 1
  },
  ratingDetails: {
    fontFamily: "SourceCodePro-Regular",
    fontSize: 13,
    color: Colors.grey,
  },
});
