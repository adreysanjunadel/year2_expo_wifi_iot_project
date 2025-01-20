import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Linking,
  PanResponder,
  Animated,
} from "react-native";
import * as Network from "expo-network";
import * as SplashScreen from "expo-splash-screen";
import { BlurView } from "expo-blur";
import HomeDropdown from "./components/HomeDropdown";
import * as Location from "expo-location";
import axios from "axios";
import MapView, { Marker, Circle } from 'react-native-maps';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Home() {
  // Load fonts first
  const [loaded, error] = useFonts({
    "SourceSans-Bold": require("../assets/fonts/SourceSans3-Bold.ttf"),
    "SourceSans-Light": require("../assets/fonts/SourceSans3-Light.ttf"),
    "SourceSans-Regular": require("../assets/fonts/SourceSans3-Regular.ttf"),
    "SourceSans-Medium": require("../assets/fonts/SourceSans3-Medium.ttf"),
  });

  const [wifiEnabled, setWifiEnabled] = useState(null);
  const [touchData, setTouchData] = useState([]);
  const [backgroundColors, setBackgroundColors] = useState([
    "#87CEEB",
    "#B0E0E6",
    "#ADD8E6", // Original gradient colors
  ]);
  const containerRef = useRef(null);
    const dropdownRef = useRef(null);
  const router = useRouter();
  const [wifiData, setWifiData] = useState([]);
    const [location, setLocation] = useState(null);
   const [dropdownVisible, setDropdownVisible] = useState(false);
    const rippleAnimations = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
    const [mapRegion, setMapRegion] = useState(null);


    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

   useEffect(() => {
        async function checkUser() {
          const userJson = await AsyncStorage.getItem("user");
            if (!userJson) router.replace("/");
        }
        checkUser();
      const checkWifiStatus = async () => {
            try {
              const networkState = await Network.getNetworkStateAsync();
                setWifiEnabled(
                    networkState.isInternetReachable &&
                       networkState.type === Network.NetworkStateType.WIFI
                    );
             } catch (error) {
                console.log("Error in checking Network State", error);
                router.replace("iswificonnected");
             }
         };
       checkWifiStatus();
        fetchWifiData();
       getLocationAsync();
    // Animate the elements to move upwards and fade in when the component is mounted
        Animated.parallel([
            Animated.timing(translateY, {
               toValue: -37.5,
               duration: 1600,
                useNativeDriver: true,
           }),
          Animated.timing(opacity, {
              toValue: 1,
                duration: 1600,
                useNativeDriver: true,
            }),
        ]).start();

  }, []);


   const getLocationAsync = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
               if (status !== 'granted') {
                   console.log('Permission to access location was denied');
                     return;
                }
          const { coords } = await Location.getCurrentPositionAsync();
            setLocation(coords);
            setMapRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.0015,
               longitudeDelta: 0.0015,
               });
         } catch (e) {
            console.log(e)
           router.replace("/")
        }
    };

    const fetchWifiData = async () => {
        try {
            const response = await axios.get(
                process.env.EXPO_PUBLIC_URL+"/RequestRouterInfo",
                {
                    headers: {
                        Authorization: process.env.GOOGLE_MAPS_API_KEY,
                    },
                }
            );
            setWifiData(response.data);
        } catch (error) {
            console.log('Error fetching WiFi data:', error);
        }
    };

  const openSettings = () => {
    Linking.openSettings().catch(() => {
      Alert.alert("Error", "Unable to open settings.");
    });
  };

  const handleProceed = () => {
    router.push("/home");
  };

  // PanResponder for detecting touch movements
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const { moveX, moveY } = gestureState;

      // Use measure to get the correct touch position relative to the container
      containerRef.current.measure((x, y, width, height, pageX, pageY) => {
        const relativeMoveX = moveX;
        const relativeMoveY = moveY;

        // Update touch data with relative position
        setTouchData([{ x: relativeMoveX, y: relativeMoveY }]);

        // Dynamically adjust the background gradient colors based on the touch position
        const touchXPercentage = relativeMoveX / width;
        const touchYPercentage = moveY / height;

        // Adjust the shade of blue based on touch position
        const adjustedBlue = Math.min(
          255,
          200 + (touchXPercentage + touchYPercentage) * 50
        );

        // Keep the base gradient and adjust only the shade of blue
        setBackgroundColors([
          `rgb(135, 206, ${adjustedBlue})`, // Light Blue
          `rgb(176, 224, ${adjustedBlue})`, // Powder Blue
          `rgb(173, 216, ${adjustedBlue})`, // Light Sky Blue
        ]);
      });

      // Reset the ripple animation only after it completes
      rippleAnimations.setValue(0); // Reset the ripple size before starting the animation
      Animated.spring(rippleAnimations, {
        toValue: 1, // Maximum size of the ripple
        friction: 8, // Moderate friction to slow down the effect
        tension: 10, // Moderate tension to make the ripple more smooth and less abrupt
        useNativeDriver: true,
      }).start();
    },
    onPanResponderRelease: () => {
      // Allow the ripple to fade out slowly and reset after animation completes
      rippleAnimations.setValue(0); // Reset the ripple size after the animation ends
      setTouchData([]); // Clear touch data after release
    },
  });

  if (!loaded && !error) {
    return null;
  }
    return (
        <LinearGradient
            colors={backgroundColors}
            style={styles.view1}
            {...panResponder.panHandlers}
        >
            <BlurView intensity={50} tint="light" style={styles.blurView} />
                <View style={styles.view2}>
                     <View style={styles.view4}>
                          <Text style={styles.title}>WiMaps</Text>
                     </View>
                     <View style={styles.dropdownContainer} >
                           <HomeDropdown stylesheet={styles.homeDropdown} toggleDropdown={toggleDropdown} buttonRef={dropdownRef}  />
                     </View>
               </View>
                 {location && (
                   <MapView
                     style={styles.map}
                     region={mapRegion}
                        >
                           <Circle
                                center={{
                                 latitude: location.latitude,
                                     longitude: location.longitude,
                                }}
                             radius={8}
                              fillColor="rgba(0, 255, 0, 0.4)"
                                strokeColor="white"
                              strokeWidth={1}
                           />
                          {wifiData.map(wifi => (
                            <Marker
                                 key={wifi.id}
                                 coordinate={{latitude: parseFloat(wifi.latitude), longitude: parseFloat(wifi.longitude)}}
                                 title={wifi.name}
                                 description={`Signal Strength: ${wifi.signalStrength}`}
                           />
                      ))}
                     </MapView>
                 )}
           <View style={styles.scanButtonContainer}>
                <Pressable
                    style={styles.scanButton}
                      onPress={async ()=> fetchWifiData()}
                  >
                    <Text style={styles.scanButtonText}>Scan WiFi Networks</Text>
                 </Pressable>
           </View>
            <Animated.View
                style={[
                   styles.container,
                  {
                    transform: [{ translateY }],
                     opacity,
                     zIndex: 0,
                    },
                ]}
               ref={containerRef}
           >
             {touchData.map((touch, index) => (
                 <Animated.View
                    key={index}
                    style={[
                       styles.touchEffect,
                         {
                             top: touch.y - 25,
                             left: touch.x - 25,
                           transform: [
                                 {
                                       scale: rippleAnimations.interpolate({
                                            inputRange: [0, 1],
                                           outputRange: [0, 4],
                                        }),
                                    },
                                ],
                                opacity: rippleAnimations.interpolate({
                                    inputRange: [0, 1],
                                      outputRange: [0.3, 0],
                                  }),
                                zIndex: 1,
                          },
                      ]}
                   >
                    <LinearGradient
                      colors={["#ADD8E6", "#4682B4", "#5F9EA0"]}
                        start={[0, 0]}
                        end={[1, 1]}
                         style={styles.gradientEffect}
                     />
               </Animated.View>
            ))}
          </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: "flex-start",
    position: "relative",
  },
   blurView: {
       position: "absolute",
       top: 0,
      left: 0,
      right: 0,
     height: 60,
       zIndex: 1000,
    },
   view2: {
        backgroundColor: "transparent",
      paddingHorizontal: 20,
      paddingVertical: 10,
       flexDirection: "row",
        columnGap: 12,
      justifyContent: "flex-start",
        alignItems: "center",
        position: "relative",
  },
  title: {
    fontSize: 28,
      fontFamily: "Fredoka-Bold",
      color: "#0011FF",
 },
   view4: {
        flex: 1,
        rowGap: 3,
   },
   dropdownContainer: {
    position: "absolute",
       top: 10,
      right: 20,
      zIndex: 1500,
     },
    dropdownListContainer: {
        position: "absolute",
      top: 40,
      right: 0,
       minWidth: 150, // Ensures dropdown adapts to content width
       backgroundColor: "#fff",
        borderRadius: 8,
       elevation: 3,
      shadowColor: "#000",
       shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
      shadowRadius: 4,
       zIndex: 1500,
     overflow: "visible",
    },
   text: {
        fontSize: 22,
        fontFamily: "SourceSans-Bold",
    },
  container: {
      alignItems: "center",
        padding: 20,
      marginTop: 40,
        flex: 1,
    },
   image: {
       width: 200,
       height: 200,
       marginBottom: 20,
    },
   text: {
      fontSize: 18,
      textAlign: "center",
       marginBottom: 20,
    },
   button: {
        backgroundColor: "coral",
     padding: 10,
       borderRadius: 25,
        marginTop: 10,
  },
    buttonText: {
      color: "#fff",
      fontSize: 16,
        textAlign: "center",
   },
   touchEffect: {
       position: "absolute",
       width: 50,
     height: 50,
      borderRadius: 25,
        overflow: "hidden",
    },
   gradientEffect: {
        flex: 1,
       width: "100%",
      height: "100%",
        borderRadius: 25,
  },
  map: {
       ...StyleSheet.absoluteFillObject,
      marginTop: 60,
      flex: 1,
        zIndex: 1,
    },
    scanButtonContainer: {
        position: 'absolute',
      bottom: 20,
       left: 0,
      right: 0,
      alignItems: 'center',
        justifyContent: 'center',
     paddingVertical: 10,
    },
    scanButton: {
        padding: 15,
       backgroundColor: "#4682B4",
        borderRadius: 8,
      elevation: 3,
        shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
       shadowRadius: 4,
        zIndex: 2,
    width: '80%',
       alignSelf: 'center'
    },
   scanButtonText:{
        color: "#fff",
       fontSize: 18,
        fontFamily: "SourceSans-Medium",
      }
});