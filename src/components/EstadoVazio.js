import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EstadoVazio({ icone, titulo, texto, textoBotao, onPress }) {
  return (
    <View style={estilos.container}>
      <View style={estilos.circulo}>
        <Ionicons name={icone} size={44} color="#222" />
      </View>
      <Text style={estilos.titulo}>{titulo}</Text>
      {texto ? <Text style={estilos.texto}>{texto}</Text> : null}
      {textoBotao && onPress ? (
        <TouchableOpacity style={estilos.botao} onPress={onPress}>
          <Text style={estilos.textoBotao}>{textoBotao}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, backgroundColor: "#fff" },
  circulo: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: "#f2f2f2",
    justifyContent: "center", alignItems: "center", marginBottom: 20,
  },
  titulo: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  texto: { fontSize: 14, color: "#777", textAlign: "center", marginTop: 8, lineHeight: 20 },
  botao: { backgroundColor: "#222", paddingVertical: 12, paddingHorizontal: 22, borderRadius: 10, marginTop: 20 },
  textoBotao: { color: "#fff", fontSize: 15, fontWeight: "600" },
});