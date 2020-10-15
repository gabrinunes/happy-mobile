import { StatusBar } from 'expo-status-bar';
import React from 'react';
import MapView, { PROVIDER_GOOGLE,Marker,Callout } from 'react-native-maps'
import { StyleSheet, Text, View,Dimensions,TouchableOpacity } from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useFonts} from 'expo-font';
import {Nunito_600SemiBold,Nunito_700Bold,Nunito_800ExtraBold} from '@expo-google-fonts/nunito';

import mapMarker from './src/images/map-marker.png';

import Routes from './src/routes'

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold
  });

  if(!fontsLoaded){
    return null;
  }

  return (
     <Routes/>
  );
}
