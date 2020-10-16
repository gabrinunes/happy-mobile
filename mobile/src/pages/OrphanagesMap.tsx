import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE,Marker,Callout } from 'react-native-maps'
import { StyleSheet, Text, View,Dimensions, Alert} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useFonts} from 'expo-font';
import {Nunito_600SemiBold,Nunito_700Bold,Nunito_800ExtraBold} from '@expo-google-fonts/nunito';

import Spinner from 'react-native-loading-spinner-overlay';
import mapMarker from '../images/map-marker.png';
import * as Location  from 'expo-location'
import * as Permmissions from 'expo-permissions'
import { useNavigation, useRoute,useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';




interface Orphanages {
  id:number;
  name:string;
  latitude:number;
  longitude:number;
}

export default function OrphanagesMap() {
  const navigation = useNavigation();
  const route = useRoute();


  const[orphanages,setOrphanages] = useState<Orphanages[]>([])
  const [position,setPosition] = useState({latitude:0,longitude:0})
  const [loadingMap,SetLoadingMap] = useState(true);

  useFocusEffect(()=>{
   getLocation();
   api.get('/orphanages').then(response=>{
     setOrphanages(response.data);
   })
  })


  async function getLocation(){
    let {status} = await Permmissions.askAsync(Permmissions.LOCATION)
    if(status =='granted'){
      let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Highest})
      const {latitude,longitude} = location.coords
      setPosition({
        latitude,
        longitude
      })
    }else{
      console.log('por favor habilite sua localização')
    }
  }

  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold
  });

  if(!fontsLoaded){
    return null;
  }

  function handleNavigateToOrphanageDetail(id:number){
      navigation.navigate('OrphanageDetails',{id})
  }

  function handleNavigateCreateOrphanage(){
    const positionMap = position
    navigation.navigate('SelectMapPosition',{position:positionMap})
  }

  return (
    <View style={styles.container}>

      {position.latitude !==0 &&(
        <MapView style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion=
        {{
        latitude:position.latitude,
        longitude:position.longitude,
        latitudeDelta:0.008,
        longitudeDelta:0.008}}>
  
            {orphanages.map(orphanage=>{
              return(
                <Marker
                key={orphanage.id}
                icon={mapMarker}
                calloutAnchor={{
                  x:2.7,
                  y:0.8,
                }}
                coordinate={{latitude:orphanage.latitude,longitude:orphanage.longitude}}
                >
                  <Callout  tooltip onPress={()=>handleNavigateToOrphanageDetail(orphanage.id)}>
                    <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                    </View>
                  </Callout>
                </Marker>
              )
            })} 
        </MapView>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

        <RectButton style={styles.createOrphanageButton} onPress={handleNavigateCreateOrphanage}>
          <Feather name="plus" size={20} color="#FFF"/>
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },

  calloutContainer:{
    width:160,
    height:46,
    paddingHorizontal:16,
    backgroundColor:'rgba(255,255,255,0.8)',
    borderRadius:16,
    justifyContent:'center'
  },

  calloutText:{
    color:'#0089a5',
    fontSize:14,
    fontFamily:'Nunito_700Bold'
  },

  footer:{
    position:'absolute',
    left:24,
    right:24,
    bottom:32,

    backgroundColor:'#FFF',
    borderRadius:20,
    height:56,
    paddingLeft:24,

    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',

    elevation:3
  },

  footerText:{
     color:'#8fa7b3',
     fontFamily:'Nunito_700Bold'
  },

  createOrphanageButton:{
    width:56,
    height:56,
    backgroundColor:'#15c3d6',
    borderRadius:20,

    justifyContent:'center',
    alignItems:'center',
  }
});