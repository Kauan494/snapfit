import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function MontarLook() {
  return (
    <View style={estilos.container}>
      <Text>Monte aqui seu look!</Text>
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