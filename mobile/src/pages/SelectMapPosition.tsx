import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { Marker, MapEvent } from 'react-native-maps';

import mapMarkerImg from '../images/map-marker.png';

interface OrphanageRouteParams{
  position:{
    latitude:number;
    longitude:number;
  }
}

export default function SelectMapPosition() {
  const navigation = useNavigation();
  const route = useRoute();
  const [position,SetPosition] = useState({latitude:0,longitude:0});

  const Orphanage = route.params as OrphanageRouteParams;


  function handleNextStep() {
    navigation.navigate('OrphanageData',{position});
  }

  function handleSelectMapPosition(event:MapEvent){
    SetPosition(event.nativeEvent.coordinate);
  }

  return (
    <View style={styles.container}>
      <MapView 
        initialRegion={{
          latitude:Orphanage.position.latitude,
          longitude:Orphanage.position.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        style={styles.mapStyle}
        onPress={handleSelectMapPosition}
      >
        {position.latitude !==0 &&(
          <Marker 
          icon={mapMarkerImg}
          coordinate={{ latitude:position.latitude, longitude:position.longitude }}
        />
        )}
      </MapView>

      {position.latitude !==0 &&(
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
        <Text style={styles.nextButtonText}>Próximo</Text>
      </RectButton>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})