import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function CameraScreen() {
  return (
    <View style={estilos.container}>
      <Text>Câmera</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});