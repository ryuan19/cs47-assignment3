import { View, StyleSheet, Text, SafeAreaView, Pressable, Image, FlatList} from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors"
import Images from "./Themes/images"
import millisToMinutesAndSeconds from "./utils/millisToMinuteSeconds.js"

// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const f = false;

export default function App() {
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    const fetchTracks = async () => {
      // TODO: Comment out which one you don't want to use
      // myTopTracks or albumTracks

      const res = await myTopTracks(token);
      //const res = await albumTracks(ALBUM_ID, token);
      setTracks(res);
    };

    if (token) {
      // Authenticated, make API request
      fetchTracks();
    }
  }, [token]);

  const renderItem = (item,index) => (
    <View style={styles.songContainer}>

          <Text style={{color:"white"}}>{index + 1}</Text>
          <Image source={{uri: item.album.images[0].url}} style={styles.spotify_logoflex}/>
          <View style={{width: 120, }}>
            <Text numberOfLines={1} style={{color:"white"}}>{item.name}</Text>
            <Text numberOfLines={1} style={{color:"white"}}>{item.artists[0].name}</Text>
          </View>
          <Text style={{width: 50,color:"white"}} numberOfLines={1}>{item.album.name}</Text>
          <Text style={{color:"white"}}>{millisToMinutesAndSeconds(item.duration_ms)}</Text>
    </View>
    /*
    <View>
      <Text style={{color:"white"}}>{item.album.name} </Text>
      <Text style={{color:"white"}}>{item.artists[0].name} </Text>
    </View>
    */
  );

  //console.log(tracks[2]);

  if (token) { //false on default
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center",}}>
          <Image source={Images.spotify} style={styles.spotify_logo}/>
          <Text style={{color:"white", fontSize: 20}}>My Top Tracks</Text>
        </View>
        <FlatList
          data={tracks}
          renderItem={({item,index}) => renderItem(item,index)}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable onPress={() => promptAsync()} style={styles.press}>
          <Image source={Images.spotify} style={styles.spotify_logo}/>
          <Text style={styles.logo}>CONNECT WITH SPOTIFY</Text>
        </Pressable>
      </SafeAreaView>

/* for the container
      <SafeAreaView style={styles.container}>
        <View style={styles.songContainer}>

          <Text>1</Text>
          <Image source={Images.spotify} style={styles.spotify_logoflex}/>
          <View style={{width: 120,}}>
            <Text numberOfLines={1}>Albumlongtitleyayayayaya</Text>
            <Text>Artist</Text>
          </View>
          <Text style={{width: 50,}} numberOfLines={1}>Album</Text>
          <Text >{millisToMinutesAndSeconds(555555)}</Text>
        </View>

      </SafeAreaView>
*/
    );
  }
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
