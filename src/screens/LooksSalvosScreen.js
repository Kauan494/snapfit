import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function LooksSalvos() {
  return (
    <View style={estilos.container}>
      <Text>Seus looks estão aqui</Text>
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