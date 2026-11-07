import React, { useState } from "react";
import {
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { prepararFoto } from "../utils/imagem";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { CORES, TIPOS } from "../data/cores";

export default function CadastrarPeca({ route, navigation }) {
 
  const { fotoUri } = route.params;

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState(null);
  const [cor, setCor] = useState(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    
    if (!nome.trim() || !tipo || !cor) {
       Alert.alert("Faltou algo", "Preencha o nome, o tipo e a cor da peça.");
       return;
    }

    setSalvando(true);
    try {
      const foto = await prepararFoto(fotoUri);

     
      await addDoc(collection(db, "pecas"), {
        nome: nome.trim(),
        tipo,
        cor,
        foto,
        criadoEm: serverTimestamp(),
      });

      Alert.alert("Pronto!", "Peça salva no guarda-roupa.");
      navigation.navigate("Abas", { screen: "GuardaRoupa" });
    } catch (erro) {
      console.log("Erro ao salvar peça:", erro);
      Alert.alert("Erro", "Não foi possível salvar a peça. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Image source={{ uri: fotoUri }} style={estilos.foto} />

      <Text style={estilos.rotulo}>Nome</Text>
      <TextInput
        style={estilos.input}
        placeholder="Ex.: Camiseta branca básica"
        value={nome}
        onChangeText={setNome}
      />

      
      <Text style={estilos.rotulo}>Tipo</Text>
      <View style={estilos.linha}>
        {TIPOS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[estilos.opcao, tipo === t.id && estilos.opcaoSelecionada]}
            onPress={() => setTipo(t.id)}
          >
            <Text style={[estilos.textoOpcao, tipo === t.id && estilos.textoSelecionado]}>
              {t.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      
      <Text style={estilos.rotulo}>Cor {cor && `— ${CORES.find((c) => c.id === cor).nome}`}</Text>
      <View style={estilos.paleta}>
        {CORES.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              estilos.bolinha,
              { backgroundColor: c.hex },
              cor === c.id && estilos.bolinhaSelecionada,
            ]}
            onPress={() => setCor(c.id)}
          />
        ))}
      </View>

      
      <TouchableOpacity style={estilos.botao} onPress={salvar} disabled={salvando}>
        {salvando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={estilos.textoBotao}>Salvar peça</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: "#fff" },
  foto: { width: "100%", height: 300, borderRadius: 12, marginBottom: 16, backgroundColor: "#eee" },
  rotulo: { fontSize: 15, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, fontSize: 15 },

  linha: { flexDirection: "row", gap: 8 },
  opcao: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1, borderColor: "#ddd", alignItems: "center",
  },
  opcaoSelecionada: { backgroundColor: "#222", borderColor: "#222" },
  textoOpcao: { fontSize: 13, color: "#333" },
  textoSelecionado: { color: "#fff", fontWeight: "600" },

  paleta: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  bolinha: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: "#ccc" },
  bolinhaSelecionada: { borderWidth: 3, borderColor: "#222", transform: [{ scale: 1.1 }] },

  botao: { backgroundColor: "#222", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 28 },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600" },
});