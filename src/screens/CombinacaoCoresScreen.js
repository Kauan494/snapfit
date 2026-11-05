import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { CORES, COMBINACOES, TIPOS } from "../data/cores";

export default function CombinacaoCores({ navigation }) {
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [pecas, setPecas] = useState([]);

  // Lê as peças do usuário para mostrar quais combinam
  useEffect(() => {
    const pararDeLer = onSnapshot(collection(db, "pecas"), (snapshot) => {
      setPecas(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return pararDeLer;
  }, []);

  const dadosCor = (id) => CORES.find((c) => c.id === id);

  // Combinações da cor escolhida
  const combinacoes = corSelecionada ? COMBINACOES[corSelecionada] : [];

  // Junta todas as cores que combinam (sem repetir)
  const coresQueCombinam = [...new Set(combinacoes.flatMap((c) => c.cores))];

  // Cores do look: a escolhida + as que combinam com ela
  const coresDoLook = corSelecionada ? [corSelecionada, ...coresQueCombinam] : [];

  // Separa as peças que combinam por tipo (cima, baixo, calçado)
  const pecasPorTipo = TIPOS.map((tipo) => ({
    ...tipo,
    pecas: pecas.filter((p) => p.tipo === tipo.id && coresDoLook.includes(p.cor)),
  }));

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.titulo}>Escolha uma cor</Text>
      <Text style={estilos.subtitulo}>
        Veja com o que ela combina antes de montar o look ou comprar uma peça.
      </Text>

      {/* Paleta */}
      <View style={estilos.paleta}>
        {CORES.map((c) => (
          <TouchableOpacity key={c.id} style={estilos.itemPaleta} onPress={() => setCorSelecionada(c.id)}>
            <View
              style={[
                estilos.bolinha,
                { backgroundColor: c.hex },
                corSelecionada === c.id && estilos.bolinhaSelecionada,
              ]}
            />
            <Text style={estilos.nomeCor} numberOfLines={1}>{c.nome}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {!corSelecionada ? (
        <Text style={estilos.aviso}>Toque em uma cor para ver as combinações.</Text>
      ) : (
        <>
          {/* Combinações */}
          <Text style={estilos.secao}>
            Combina com {dadosCor(corSelecionada).nome.toLowerCase()}
          </Text>

          {combinacoes.map((combo, indice) => (
            <View key={indice} style={estilos.card}>
              <View style={estilos.amostras}>
                {[corSelecionada, ...combo.cores].map((idCor) => (
                  <View key={idCor} style={[estilos.amostra, { backgroundColor: dadosCor(idCor).hex }]} />
                ))}
              </View>
              <View style={estilos.textosCard}>
                <Text style={estilos.estilo}>{combo.estilo}</Text>
                <Text style={estilos.coresTexto}>
                  {[corSelecionada, ...combo.cores].map((id) => dadosCor(id).nome).join(" + ")}
                </Text>
                <Text style={estilos.dica}>{combo.dica}</Text>
              </View>
            </View>
          ))}

          {/* Peças do usuário que combinam, separadas por tipo */}
          <Text style={estilos.secao}>Do seu guarda-roupa</Text>

          {pecasPorTipo.map((grupo) => (
            <View key={grupo.id} style={estilos.grupo}>
              <Text style={estilos.tituloGrupo}>{grupo.nome}</Text>

              {grupo.pecas.length === 0 ? (
                <Text style={estilos.avisoGrupo}>Nenhuma peça que combine.</Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={estilos.listaPecas}
                >
                  {grupo.pecas.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={estilos.peca}
                      onPress={() => navigation.navigate("DetalhePeca", { id: p.id })}
                    >
                      <Image source={{ uri: p.foto }} style={estilos.fotoPeca} />
                      <View style={estilos.infoPeca}>
                        <View style={[estilos.bolinhaPeca, { backgroundColor: dadosCor(p.cor)?.hex }]} />
                        <Text style={estilos.nomePeca} numberOfLines={1}>{p.nome}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "700" },
  subtitulo: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 16 },

  paleta: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  itemPaleta: { width: 58, alignItems: "center" },
  bolinha: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: "#ccc" },
  bolinhaSelecionada: { borderWidth: 3, borderColor: "#222", transform: [{ scale: 1.1 }] },
  nomeCor: { fontSize: 11, color: "#444", marginTop: 4 },

  aviso: { fontSize: 14, color: "#888", textAlign: "center", marginTop: 20 },
  secao: { fontSize: 17, fontWeight: "700", marginTop: 24, marginBottom: 12 },

  card: {
    flexDirection: "row", alignItems: "center", gap: 14,
    padding: 12, borderRadius: 12, backgroundColor: "#f5f5f5", marginBottom: 10,
  },
  amostras: { flexDirection: "row" },
  amostra: { width: 30, height: 48, borderWidth: 1, borderColor: "#ddd" },
  textosCard: { flex: 1 },
  estilo: { fontSize: 15, fontWeight: "700" },
  coresTexto: { fontSize: 13, color: "#444", marginTop: 2 },
  dica: { fontSize: 12, color: "#777", marginTop: 4 },

  grupo: { marginBottom: 16 },
  tituloGrupo: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 8 },
  avisoGrupo: { fontSize: 13, color: "#999" },
  listaPecas: { gap: 10 },
  peca: { width: 110 },
  fotoPeca: { width: 110, height: 140, borderRadius: 10, backgroundColor: "#eee" },
  infoPeca: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  bolinhaPeca: { width: 10, height: 10, borderRadius: 5, borderWidth: 1, borderColor: "#ccc" },
  nomePeca: { flex: 1, fontSize: 12 },
});