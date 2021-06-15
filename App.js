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
import MapViewDirections from "react-native-maps-directions";
import { getPixelSize } from "./utils";

export default function App() {
  const mapEl = useRef(null);
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
        ref={mapEl}
      >
        {destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={config.googleApi}
            strokeWidth={3}
            onReady={(result) => {
              mapEl.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  top: getPixelSize(120),
                  bottom: getPixelSize(120),
                  left: getPixelSize(120),
                  right: getPixelSize(120),
                },
              });
            }}
          />
        )}
      </MapView>

      <GooglePlacesAutocomplete
        placeholder="Para Onde?"
        onPress={(data, details) => {
          setDestination({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          });
        }}
        query={{
          key: config.googleApi,
          language: "pt-br",
        }}
        fetchDetails={true}
        styles={{
          container: {
            position: "absolute",
            top: 60,
            width: "100%",
          },
          textInputContainer: {
            flex: 1,
            backgroundColor: "transparent",
            height: 54,
            marginHorizontal: 20,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            height: 54,
            margin: 0,
            borderRadius: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 20,
            paddingRight: 20,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { x: 0, y: 0 },
            shadowRadius: 15,
            borderWidth: 1,
            borderColor: "#DDD",
            fontSize: 18,
          },
          listView: {
            borderWidth: 1,
            borderColor: "#DDD",
            backgroundColor: "#FFF",
            marginHorizontal: 20,
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { x: 0, y: 0 },
            shadowRadius: 15,
            marginTop: 10,
          },
          description: {
            fontSize: 16,
          },
          row: {
            padding: 20,
            height: 58,
          },
        }}
      />
    </View>
  );
}
