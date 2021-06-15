import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { css } from "./assets/Css/Css";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { LOCATION_BACKGROUND } from "expo-permissions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import config from "./config";

export default function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    (async function () {
      const { status, permissions } = await Permissions.askAsync(
        Permissions.LOCATION_BACKGROUND
      );
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.00922,
          longitudeDelta: 0.00421,
        });
      } else {
        throw new Error("Location permission not granted");
      }
    })();
  }, []);

  return (
    <View style={css.container}>
      <MapView
        style={css.map}
        initialRegion={origin}
        showsUserLocation={true}
      ></MapView>
      <View style={css.search}>
        <GooglePlacesAutocomplete
          placeholder="Para Onde?"
          onPress={(data, details) => {
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            });
            console.log(destination);
          }}
          query={{
            key: config.googleApi,
            language: "pt-br",
          }}
          fetchDetails={true}
          styles={{
            listView: {
              height: 100,
            },
          }}
        />
      </View>
    </View>
  );
}
