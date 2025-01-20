import { useRouter } from "expo-router";
import React, {useState, useRef, useEffect} from 'react';
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  Linking,
  PanResponder,
  Animated,
} from "react-native";
import * as Network from "expo-network";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function isWifiConnected() {
  const [loaded, error] = useFonts({
    "SourceSans-Bold": require("../assets/fonts/SourceSans3-Bold.ttf"),
    "SourceSans-Light": require("../assets/fonts/SourceSans3-Light.ttf"),
    "SourceSans-Regular": require("../assets/fonts/SourceSans3-Regular.ttf"),
    "SourceSans-Medium": require("../assets/fonts/SourceSans3-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const [wifiEnabled, setWifiEnabled] = useState(null);
  const [touchData, setTouchData] = useState([]);
  const [backgroundColors, setBackgroundColors] = useState([
    "#87CEEB",
    "#B0E0E6",
    "#ADD8E6", // Original gradient colors
  ]);
  const containerRef = useRef(null); // Reference to the container
  const router = useRouter();

  const rippleAnimations = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current; // To animate the upward movement of elements
  const opacity = useRef(new Animated.Value(0)).current; // For fading in elements

  useEffect(() => {
    const checkWifiStatus = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        setWifiEnabled(
          networkState.isInternetReachable &&
            networkState.type === Network.NetworkStateType.WIFI
        );
      } catch (error) {
        console.log("Error in checking Network State", error);
        Alert.alert("Error", "Failed to check WiFi status.");
      }
    };

    checkWifiStatus();

    // Animate the elements to move upwards and fade in when the component is mounted
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -37.5, // Moves the elements 50 units upwards
        duration: 1600, // Duration of the animation
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1, // Fade in the elements
        duration: 1600, // Duration of the fade-in animation
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
        const touchYPercentage = relativeMoveY / height;

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

  return (
    <LinearGradient
      colors={backgroundColors} // Use dynamic background gradient
      style={styles.view1}
      {...panResponder.panHandlers} // Attach PanResponder to the gradient
    >
      
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }], // Apply translateY for upward movement
            opacity, // Apply the opacity animation to fade in the elements
            zIndex: 0, // Ensure this layer is under the ripple effect
          },
        ]}
        ref={containerRef}
      >
        <Image source={require("../assets/WiMaps.png")} style={styles.image} />
        <Text style={styles.text}>
          Welcome to WiMaps! Ensure WiFi is enabled
        </Text>

        {wifiEnabled === null ? (
          <Text style={styles.text}>Checking WiFi status...</Text>
        ) : wifiEnabled ? (
          <Pressable style={styles.button} onPress={handleProceed}>
            <Text style={styles.buttonText}>Proceed to Home</Text>
          </Pressable>
        ) : (
          <View>
            <Text style={styles.text}>
              WiFi is not enabled. Please enable it to proceed.
            </Text>
            <Pressable style={styles.button} onPress={openSettings}>
              <Text style={styles.buttonText}>Go to Settings</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>

      {/* Render the gradient ripple effect with animation */}
      {touchData.map((touch, index) => (
        <Animated.View
          key={index}
          style={[
            styles.touchEffect,
            {
              top: touch.y - 25, // Position the touch effect exactly at the touch point
              left: touch.x - 25, // Position horizontally based on the touch location
              transform: [
                {
                  scale: rippleAnimations.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 4], // Animate from small to large ripple
                  }),
                },
              ],
              opacity: rippleAnimations.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0], // Fade out the ripple
              }),
              zIndex: 1, // Ensure the ripple effect is always on top
            },
          ]}
        >
          {/* Apply the gradient effect around the touch */}
          <LinearGradient
            colors={["#ADD8E6", "#4682B4", "#5F9EA0"]} // Blue spectrum for touch effect
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradientEffect}
          />
        </Animated.View>
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  text: {
    fontSize: 22,
    fontFamily: "SourceSans-Bold",
  },
  container: {
    alignItems: "center",
    padding: 20,
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
    width: 50, // Adjust size of the gradient distortion effect
    height: 50,
    borderRadius: 25, // Rounded effect to mimic the yeast drop-like distortion
    overflow: "hidden",
  },
  gradientEffect: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
});
