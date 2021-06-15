import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef, Fragment } from "react";
import { Text, View, Image } from "react-native";
import { css } from "./assets/Css/Css";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { LOCATION_BACKGROUND } from "expo-permissions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import config from "./config";
import MapViewDirections from "react-native-maps-directions";
import { getPixelSize } from "./utils";
import markerImage from "./assets/marker.png";
import backImage from "./assets/back.png";
import {
  Back,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
} from "./assets/Css/styles";
import Geocoder from "react-native-geocoding";
import Details from "./components/Details";

Geocoder.init(config.googleApi);

export default function App() {
  const mapEl = useRef(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [duration, setDuration] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async function () {
      const { status, permissions } = await Permissions.askAsync(
        Permissions.LOCATION_BACKGROUND
      );
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        const locationMoreDetails = await Geocoder.from({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        const address = locationMoreDetails.results[0].formatted_address;
        const locationText = address.substring(0, address.indexOf(","));
        setLocation(locationText);
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

  handleBack = () => {
    setDestination(null);
  };

  return (
    <View style={css.container}>
      <MapView
        style={css.map}
        initialRegion={origin}
        showsUserLocation={true}
        ref={mapEl}
      >
        {destination && (
          <Fragment>
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={config.googleApi}
              strokeWidth={3}
              onReady={(result) => {
                setDuration(Math.floor(result.duration));
                mapEl.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    top: getPixelSize(120),
                    bottom: getPixelSize(350),
                    left: getPixelSize(120),
                    right: getPixelSize(120),
                  },
                });
              }}
            />
            <Marker
              coordinate={destination}
              anchor={{ x: 0, y: 0 }}
              image={markerImage}
            >
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker>
            <Marker coordinate={origin} anchor={{ x: 0, y: 0 }}>
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>
          </Fragment>
        )}
      </MapView>

      {destination ? (
        <Fragment>
          <Back onPress={this.handleBack}>
            <Image source={backImage} />
          </Back>
          <Details />
        </Fragment>
      ) : (
        <GooglePlacesAutocomplete
          placeholder="Para Onde?"
          onPress={(data, details) => {
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
              title: details.name,
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
      )}
    </View>
  );
}
