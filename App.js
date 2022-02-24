import { View, StyleSheet, Text, SafeAreaView, Pressable, Image, FlatList} from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "./utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "./utils/constants";
import Colors from "./Themes/colors"
import Images from "./Themes/images"
import millisToMinutesAndSeconds from "./utils/millisToMinuteSeconds.js"
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './HomePage.js';

// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

const f = false;
const Stack = createStackNavigator();

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

  function Details({ route }) {
    const link = route.params.link;
    return (
        <WebView source={{ uri: link }} />

    );
  }

  function Preview({ route }) {
    const songlink= route.params.songlink;
    return (
        <WebView source={{ uri: songlink }} />
    );
  }


  if (token) { //false on default
    return (
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Back" options={{headerShown: false}}>
          { props => <HomePage {...props} mysongs={tracks} />}
        </Stack.Screen>
        <Stack.Screen options={{
          title: 'Song Details',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
        }} name="deets" component={Details} />

        <Stack.Screen options={{
          title: 'Song Preview',
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
        }} name="pre" component={Preview} />
      </Stack.Navigator>
    </NavigationContainer>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Pressable onPress={() => promptAsync()} style={styles.press}>
          <Image source={Images.spotify} style={styles.spotify_logo}/>
          <Text style={styles.logo}>CONNECT WITH SPOTIFY</Text>
        </Pressable>
      </SafeAreaView>
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
/*
  function listScreen({navigation}) {
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
  }



  const renderItem = (item,index) => (
    <Pressable>
        <View style={styles.songContainer}>
          <Pressable onPress={(e) => playButton(e, item.preview_url)}>
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
  */