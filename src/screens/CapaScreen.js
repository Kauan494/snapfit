import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Intro from "../components/Intro";

const RECURSOS = [
  { icone: "camera-outline", texto: "Fotografe suas peças" },
  { icone: "sparkles-outline", texto: "Monte e sorteie looks" },
  { icone: "color-palette-outline", texto: "Descubra combinações de cores" },
];

export default function Capa({ navigation }) {
  return (
    <View style={estilos.container}>
      <View style={estilos.topo}>
        <View style={estilos.icones}>
          <View style={[estilos.circulo, estilos.circuloLateral]}>
            <Ionicons name="camera" size={28} color="#fff" />
          </View>
          <View style={[estilos.circulo, estilos.circuloCentral]}>
            <Ionicons name="shirt" size={44} color="#111" />
          </View>
          <View style={[estilos.circulo, estilos.circuloLateral]}>
            <Ionicons name="color-palette" size={28} color="#fff" />
          </View>
        </View>

        <Intro tamanho={52} clara />
        <Text style={estilos.slogan}>
          Fotografe suas roupas.{"\n"}Monte looks que combinam.
        </Text>
      </View>

      <View style={estilos.rodape}>
        {RECURSOS.map((r) => (
          <View key={r.icone} style={estilos.recurso}>
            <Ionicons name={r.icone} size={20} color="#FF6B4A" />
            <Text style={estilos.textoRecurso}>{r.texto}</Text>
          </View>
        ))}

        <TouchableOpacity style={estilos.botao} onPress={() => navigation.replace("Abas")}>
          <Text style={estilos.textoBotao}>Começar</Text>
          <Ionicons name="arrow-forward" size={20} color="#111" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", paddingHorizontal: 28, paddingTop: 80, paddingBottom: 48 },
  topo: { flex: 1, justifyContent: "center", alignItems: "center" },

  icones: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 32 },
  circulo: { justifyContent: "center", alignItems: "center" },
  circuloCentral: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#FF6B4A" },
  circuloLateral: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#2a2a2a" },

  slogan: { color: "#bbb", fontSize: 17, textAlign: "center", marginTop: 14, lineHeight: 25 },

  rodape: { gap: 14 },
  recurso: { flexDirection: "row", alignItems: "center", gap: 12 },
  textoRecurso: { color: "#eee", fontSize: 15 },

  botao: {
    flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8,
    backgroundColor: "#fff", paddingVertical: 16, borderRadius: 14, marginTop: 18,
  },
  textoBotao: { color: "#111", fontSize: 17, fontWeight: "700" },
});