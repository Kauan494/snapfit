import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function DetalhePeca() {
  return (
    <View style={estilos.container}>
      <Text>Detalhe de peças</Text>
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