import { View, StyleSheet, Text, SafeAreaView, Pressable, Image, FlatList} from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors"
import Images from "./Themes/images"
import millisToMinutesAndSeconds from "./utils/millisToMinuteSeconds.js"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomePage({ mysongs }) {
  const navigation = useNavigation();

  const renderItem = (item) => (
    <Pressable onPress={() => navigation.navigate("deets", {link: item.external_urls.spotify})}>
        <View style={styles.songContainer}>
          <Pressable onPress={() => navigation.navigate("pre", {songlink: item.preview_url})}>
            <Ionicons name="play-circle-outline" size={28} color="green"/>
          </Pressable>
          <Image source={{uri: item.album.images[0].url}} style={styles.spotify_logoflex}/>
          <View style={{width: 120, }}>
            <Text numberOfLines={1} style={{color:"white"}}>{item.name}</Text>
            <Text numberOfLines={1} style={{color:"white"}}>{item.artists[0].name}</Text>
          </View>
          <Text style={{width: 50,color:"white"}} numberOfLines={1}>{item.album.name}</Text>
          <Text style={{color:"white"}}>{millisToMinutesAndSeconds(item.duration_ms)}</Text>
       </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center",}}>
        <Image source={Images.spotify} style={styles.spotify_logo}/>
        <Text style={{color:"white", fontSize: 20}}>My Top Tracks</Text>
      </View>
      <FlatList
        data={mysongs}
        renderItem={({item,index}) => renderItem(item,index)}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }, press: {
    paddingLeft: 10,
    borderRadius: 99999,
    backgroundColor: "#1DB954",
    flexDirection: "row",
    alignItems: "center",
    width: 230,
    height: 35,
  },logo: {
    paddingLeft: 3,
    color: "white",
    fontSize: 15,
    justifyContent: "center",
    height: 20,
  }, spotify_logo: {
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
  }, spotify_logoflex: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,

  },songContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: 350,
    height: 50,
  }, title_artist: {
    fontSize: 5
  }

});