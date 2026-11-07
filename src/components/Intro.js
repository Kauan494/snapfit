import React from "react";
import { Text, StyleSheet } from "react-native";

export default function Intro({ tamanho = 22, clara = false }) {
  return (
    <Text style={[estilos.marca, { fontSize: tamanho, color: clara ? "#fff" : "#222" }]}>
      Snap<Text style={estilos.destaque}>Fit</Text>
    </Text>
  );
}

const estilos = StyleSheet.create({
  marca: { fontWeight: "800", letterSpacing: -0.5 },
  destaque: { color: "#FF6B4A" },
});