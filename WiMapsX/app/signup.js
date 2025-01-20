import { useRouter } from "expo-router";
import React, {useState, useRef, useEffect} from 'react';
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Text,
  View,
  Pressable,
  Alert,
  PanResponder,
  Animated,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function signup() {
  const logoPath = require("../assets/WiMaps.png");

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getEmail, setEmail] = useState("");

  const [touchData, setTouchData] = useState([]);
  const [backgroundColors, setBackgroundColors] = useState([
    "#87CEEB",
    "#B0E0E6",
    "#ADD8E6",
  ]);

  const rippleAnimations = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const containerRef = useRef(null);

  const router = useRouter();

  // Fonts loaded hook
  const [loaded, error] = useFonts({
    "SourceSans-Bold": require("../assets/fonts/SourceSans3-Bold.ttf"),
    "SourceSans-Light": require("../assets/fonts/SourceSans3-Light.ttf"),
    "SourceSans-Regular": require("../assets/fonts/SourceSans3-Regular.ttf"),
    "SourceSans-Medium": require("../assets/fonts/SourceSans3-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // Animate elements when component mounts
  useEffect(() => {
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

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, { moveX, moveY }) => {
      containerRef.current?.measure((x, y, width, height, pageX, pageY) => {
        const touchXPercentage = moveX / width;
        const touchYPercentage = moveY / height;
        const adjustedBlue = Math.min(
          255,
          200 + (touchXPercentage + touchYPercentage) * 55
        );
        setBackgroundColors([
          `rgb(135, 206, ${adjustedBlue})`,
          `rgb(176, 224, ${adjustedBlue})`,
          `rgb(173, 216, ${adjustedBlue})`,
        ]);
      });

      rippleAnimations.setValue(0);
      Animated.spring(rippleAnimations, {
        toValue: 1,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderRelease: () => {
      rippleAnimations.setValue(0);
      setTouchData([]);
    },
  });

  if (!loaded && !error) return null;

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Ensures taps register correctly
        >
          <View style={styles.view2}>
            <Text style={styles.text}>Create Account</Text>

            <Text style={styles.text1}>
              Welcome to WiMaps! Internet Navigated.
            </Text>

            <Text style={styles.text2}>Mobile</Text>
            <TextInput
              style={[styles.input1, { zIndex: 10 }]}
              inputMode="tel"
              maxLength={10}
              placeholder={"Ex: 0777712345"}
              onChangeText={(text) => {
                setMobile(text);
              }}
            />

            <Text style={styles.text2}>First Name</Text>
            <TextInput
              style={[styles.input1, { zIndex: 10 }]}
              inputMode="text"
              placeholder={"Ex: Kevin"}
              onChangeText={(text) => {
                setFirstName(text);
              }}
            />

            <Text style={styles.text2}>Last Name</Text>
            <TextInput
              style={[styles.input1, { zIndex: 10 }]}
              inputMode="text"
              placeholder={"Ex: McCallister"}
              onChangeText={(text) => {
                setLastName(text);
              }}
            />

            <Text style={styles.text2}>Email</Text>
            <TextInput
              style={[styles.input1, { zIndex: 10 }]}
              inputMode="text"
              placeholder={"Ex: kevin_homealone@gmail.com"}
              onChangeText={(text) => {
                setEmail(text);
              }}
            />

            <Pressable
              style={styles.pressable1}
              onPress={async () => {
                try {
                  let requestData = {
                    mobile: getMobile,
                    first_name: getFirstName,
                    last_name: getLastName,
                    email: getEmail,
                  };

                  let response = await fetch(
                    process.env.EXPO_PUBLIC_URL + "/SignUp",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json", // Ensure server recognizes JSON payload
                      },
                      body: JSON.stringify(requestData), // Convert object to JSON string
                    }
                  );

                  if (response.ok) {
                    let json = await response.json();

                    if (json.success) {
                      // User Registration Completed
                      router.replace("/");
                    } else {
                      // Problem occurred
                      Alert.alert("Error", json.message);
                    }
                  } else {
                    Alert.alert("Error", "Unable to connect to server");
                  }
                } catch (error) {
                  console.error("Error occurred:", error);
                  Alert.alert("Error", "An unexpected error occurred");
                }
              }}
            >
              <FontAwesome6 name={"user-plus"} size={26} color={"white"} />

              <Text style={styles.text3}>Sign Up</Text>
            </Pressable>

            <Pressable
              style={styles.pressable2}
              onPress={() => {
                router.replace("/");
              }}
            >
              <Text style={styles.text3}>Already Registered? Log In</Text>
            </Pressable>
          </View>
        </ScrollView>
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
              zIndex: 1, // Ensure the ripple effect stays below inputs
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
    fontSize: 32,
    fontFamily: "SourceSans-Bold",
    marginBottom: 5,
  },
  container: {
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignSelf: "center",
  },
  text1: {
    fontSize: 20,
    fontFamily: "SourceSans-Medium",
    marginBottom: -5,
  },
  text2: {
    fontSize: 20,
    fontFamily: "SourceSans-Bold",
    marginTop: 5,
  },
  text3: {
    marginLeft: 10,
    fontSize: 22,
    fontFamily: "SourceSans-Medium",
    color: "white",
  },
  input1: {
    width: "100%",
    height: 50,
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 15,
    paddingStart: 10,
    fontSize: 18,
    fontFamily: "SourceSans-Medium",
  },

  pressable1: {
    height: 50,
    backgroundColor: "#3ee7f1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    columnGap: 10,
    marginTop: 20,
  },

  pressable2: {
    height: 50,
    backgroundColor: "#00192c",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    zIndex: 20,
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
  view2: {
    flex: 1,
    padding: 5,
    rowGap: 10,
  },
});
