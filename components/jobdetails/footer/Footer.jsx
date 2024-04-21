import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Linking } from "react-native";
import styles from "./footer.style";
import { icons } from "../../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Footer = ({ url, id }) => {
  // Use useState with an initial value of null for 'heart'
  const [heart, setHeart] = useState(null);

  const pressHeart = () => {
    setHeart(!heart);
  };

  const storageKey = `@MyApp:heart_${id}`;

  const storeHeart = async (heartValue) => {
    try {
      await AsyncStorage.setItem(storageKey, String(heartValue));
    } catch (error) {
      console.log(error);
    }
  };

  const getHeart = async () => {
    try {
      const heartValue = await AsyncStorage.getItem(storageKey);
      setHeart(heartValue === "true" ? true : false); // Convert heartValue to boolean
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHeart();
  }, []);

  useEffect(() => {
    if (heart !== null) {
      storeHeart(heart); // in this case it can only be true or false
    }
  }, [heart]); //run this effect only when heart is not null

  if (heart === null) {
    return null; // or a loading indicator
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.likeBtn} onPress={pressHeart}>
        <Image
          source={heart ? icons.heartFilled : icons.heartOutline}
          resizeMode="contain"
          style={styles.likeBtnImage}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.applyBtn} onPress={() => Linking.openURL(url)}>
        <Text style={styles.applyBtnText}>Apply For Job</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
