import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function CombinacaoCores() {
  return (
    <View style={estilos.container}>
      <Text>Combine cores</Text>
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