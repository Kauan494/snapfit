import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  TextInput, Alert, ActivityIndicator,
} from "react-native";
import {
  collection, onSnapshot, orderBy, query, doc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import EstadoVazio from "../components/EstadoVazio";

export default function LooksSalvos({ navigation }) {
  const [looks, setLooks] = useState([]);
  const [carregando, setCarregando] = useState(true);

 
  const [editandoId, setEditandoId] = useState(null);
  const [novoNome, setNovoNome] = useState("");

  // READ
  useEffect(() => {
    const consulta = query(collection(db, "looks"), orderBy("criadoEm", "desc"));

    const pararDeLer = onSnapshot(
      consulta,
      (snapshot) => {
        setLooks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setCarregando(false);
      },
      (erro) => {
        console.log("Erro ao buscar looks:", erro);
        setCarregando(false);
      }
    );

    return pararDeLer;
  }, []);

  
  function iniciarEdicao(look) {
    setEditandoId(look.id);
    setNovoNome(look.nome);
  }

  // UPDATE
  async function salvarNome(id) {
    if (!novoNome.trim()) {
      Alert.alert("Nome vazio", "Digite um nome para o look.");
      return;
    }
    try {
      await updateDoc(doc(db, "looks", id), { nome: novoNome.trim() });
      setEditandoId(null);
    } catch (erro) {
      console.log("Erro ao renomear:", erro);
      Alert.alert("Erro", "Não foi possível renomear o look.");
    }
  }

  // DELETE
  function confirmarExclusao(look) {
    Alert.alert("Excluir look", `Tem certeza que quer excluir "${look.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "looks", look.id));
          } catch (erro) {
            console.log("Erro ao excluir:", erro);
            Alert.alert("Erro", "Não foi possível excluir o look.");
          }
        },
      },
    ]);
  }

  // Card de cada look
  function renderLook({ item }) {
    const editando = editandoId === item.id;

    return (
      <View style={estilos.card}>
        {/* Nome ou campo de edição */}
        {editando ? (
          <View style={estilos.linhaEdicao}>
            <TextInput
              style={estilos.input}
              value={novoNome}
              onChangeText={setNovoNome}
              autoFocus
            />
            <TouchableOpacity style={estilos.botaoPequeno} onPress={() => salvarNome(item.id)}>
              <Text style={estilos.textoBotaoPequeno}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditandoId(null)}>
              <Text style={estilos.cancelar}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={estilos.cabecalho}>
            <Text style={estilos.nome} numberOfLines={1}>{item.nome}</Text>
            <View style={[estilos.selo, item.combina ? estilos.seloOk : estilos.seloAlerta]}>
              <Text style={estilos.textoSelo}>{item.combina ? "Combina" : "Ousado"}</Text>
            </View>
          </View>
        )}

       
        <View style={estilos.fotos}>
          {item.itens?.map((peca) => (
            <View key={peca.tipo} style={estilos.itemFoto}>
              <Image source={{ uri: peca.foto }} style={estilos.foto} />
              <Text style={estilos.nomePeca} numberOfLines={1}>{peca.nome}</Text>
            </View>
          ))}
        </View>

        
        {!editando && (
          <View style={estilos.acoes}>
            <TouchableOpacity onPress={() => iniciarEdicao(item)}>
              <Text style={estilos.acao}>Renomear</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmarExclusao(item)}>
              <Text style={[estilos.acao, estilos.acaoExcluir]}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  if (carregando) {
    return <View style={estilos.centro}><ActivityIndicator size="large" /></View>;
  }

  if (looks.length === 0) {
    return (
      <EstadoVazio
        icone="bookmark-outline"
        titulo="Nenhum look salvo"
        texto="Monte um look com suas peças ou agite o celular para sortear um."
        textoBotao="Montar um look"
        onPress={() => navigation.navigate("MontarLook")}
      />
    );
  }

  return (
    <FlatList
      data={looks}
      keyExtractor={(item) => item.id}
      renderItem={renderLook}
      contentContainerStyle={estilos.lista}
      style={estilos.container}
    />
  );
}

const estilos = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#fff" },
  lista: { padding: 16, gap: 14 },

  card: { backgroundColor: "#f5f5f5", borderRadius: 14, padding: 14 },
  cabecalho: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  nome: { flex: 1, fontSize: 17, fontWeight: "700" },
  selo: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  seloOk: { backgroundColor: "#E8F5E9" },
  seloAlerta: { backgroundColor: "#FFF3E0" },
  textoSelo: { fontSize: 12, fontWeight: "600" },

  fotos: { flexDirection: "row", gap: 8, marginTop: 12 },
  itemFoto: { flex: 1 },
  foto: { width: "100%", aspectRatio: 3 / 4, borderRadius: 8, backgroundColor: "#eee" },
  nomePeca: { fontSize: 11, color: "#555", marginTop: 4 },

  acoes: { flexDirection: "row", justifyContent: "flex-end", gap: 20, marginTop: 12 },
  acao: { fontSize: 14, fontWeight: "600", color: "#222" },
  acaoExcluir: { color: "#C62828" },

  linhaEdicao: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: {
    flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8,
    paddingVertical: 8, paddingHorizontal: 10, fontSize: 15, backgroundColor: "#fff",
  },
  botaoPequeno: { backgroundColor: "#222", paddingVertical: 9, paddingHorizontal: 12, borderRadius: 8 },
  textoBotaoPequeno: { color: "#fff", fontWeight: "600" },
  cancelar: { fontSize: 18, color: "#888", paddingHorizontal: 4 },

  vazio: { fontSize: 16, color: "#666", marginBottom: 16 },
  botao: { backgroundColor: "#222", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  textoBotao: { color: "#fff", fontSize: 15, fontWeight: "600" },
});