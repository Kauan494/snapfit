import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { CORES, TIPOS } from "../data/cores";
import EstadoVazio from "../components/EstadoVazio";

export default function GuardaRoupa({ navigation }) {
  const [pecas, setPecas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("todos");

   // lê a coleção pecas
  useEffect(() => {
    const consulta = query(collection(db, "pecas"), orderBy("criadoEm", "desc"));

    const pararDeLer = onSnapshot(
      consulta,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPecas(lista);
        setCarregando(false);
      },
      (erro) => {
        console.log("Erro ao buscar peças:", erro);
        setCarregando(false);
      }
    );

    return pararDeLer;
  }, []);

  // Aplica o filtro escolhido
  const pecasFiltradas = filtro === "todos" ? pecas : pecas.filter((p) => p.tipo === filtro);

  
  function corHex(idCor) {
    const encontrada = CORES.find((c) => c.id === idCor);
    return encontrada ? encontrada.hex : "#ccc";
  }

  // Card de cada peça
  function renderPeca({ item }) {
    return (
      <TouchableOpacity
        style={estilos.card}
        onPress={() => navigation.navigate("DetalhePeca", { id: item.id })}
      >
        <Image source={{ uri: item.foto }} style={estilos.foto} />
        <View style={estilos.infoCard}>
          <View style={[estilos.bolinha, { backgroundColor: corHex(item.cor) }]} />
          <Text style={estilos.nome} numberOfLines={1}>{item.nome}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (carregando) {
    return <View style={estilos.centro}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={estilos.container}>
      
      <View style={estilos.filtros}>
        {[{ id: "todos", nome: "Todos" }, ...TIPOS].map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[estilos.chip, filtro === t.id && estilos.chipSelecionado]}
            onPress={() => setFiltro(t.id)}
          >
            <Text style={[estilos.textoChip, filtro === t.id && estilos.textoChipSelecionado]}>
              {t.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {pecasFiltradas.length === 0 ? (
        pecas.length === 0 ? (
          <EstadoVazio
            icone="shirt-outline"
            titulo="Seu guarda-roupa está vazio"
            texto="Fotografe suas roupas para começar a montar looks."
            textoBotao="Fotografar uma peça"
            onPress={() => navigation.navigate("Camera")}
          />
        ) : (
          <EstadoVazio
            icone="filter-outline"
            titulo="Nenhuma peça desse tipo"
            texto="Tente outro filtro ou cadastre uma peça nova."
          />
        )
      ) : (
        <FlatList
          data={pecasFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={renderPeca}
          numColumns={2}
          columnWrapperStyle={estilos.colunas}
          contentContainerStyle={estilos.lista}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },

  filtros: { flexDirection: "row", gap: 8, padding: 16, paddingBottom: 8, flexWrap: "wrap" },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: "#ddd" },
  chipSelecionado: { backgroundColor: "#222", borderColor: "#222" },
  textoChip: { fontSize: 13, color: "#333" },
  textoChipSelecionado: { color: "#fff", fontWeight: "600" },

  lista: { padding: 16, paddingTop: 8 },
  colunas: { gap: 12, marginBottom: 12 },
  card: { flex: 1, borderRadius: 12, backgroundColor: "#f5f5f5", overflow: "hidden" },
  foto: { width: "100%", aspectRatio: 3 / 4, backgroundColor: "#eee" },
  infoCard: { flexDirection: "row", alignItems: "center", gap: 6, padding: 10 },
  bolinha: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: "#ccc" },
  nome: { flex: 1, fontSize: 14, fontWeight: "500" },

 
});