import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function GuardaRoupa() {
  return (
    <View style={estilos.container}>
      <Text>Seu Guarda Roupa</Text>
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