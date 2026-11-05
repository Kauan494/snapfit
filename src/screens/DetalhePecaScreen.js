import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { CORES, TIPOS } from "../data/cores";

export default function DetalhePeca({ route, navigation }) {
  // ID da peça que veio da tela Guarda-roupa
  const { id } = route.params;

  const [peca, setPeca] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);

 
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState(null);
  const [cor, setCor] = useState(null);

  // Busca a peça no Firestore pelo ID
  useEffect(() => {
    async function carregar() {
      try {
        const documento = await getDoc(doc(db, "pecas", id));
        if (documento.exists()) {
          const dados = { id: documento.id, ...documento.data() };
          setPeca(dados);
          setNome(dados.nome);
          setTipo(dados.tipo);
          setCor(dados.cor);
        } else {
          Alert.alert("Ops", "Essa peça não existe mais.");
          navigation.goBack();
        }
      } catch (erro) {
        console.log("Erro ao carregar peça:", erro);
        Alert.alert("Erro", "Não foi possível carregar a peça.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  //salva as alterações
  async function salvarEdicao() {
    if (!nome.trim() || !tipo || !cor) {
      Alert.alert("Faltou algo", "Preencha o nome, o tipo e a cor da peça.");
      return;
    }

    setSalvando(true);
    try {
      await updateDoc(doc(db, "pecas", id), { nome: nome.trim(), tipo, cor });
      setPeca({ ...peca, nome: nome.trim(), tipo, cor });
      setEditando(false);
      Alert.alert("Pronto!", "Peça atualizada.");
    } catch (erro) {
      console.log("Erro ao atualizar:", erro);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  // Cancela a edição e volta os campos ao que estava salvo
  function cancelarEdicao() {
    setNome(peca.nome);
    setTipo(peca.tipo);
    setCor(peca.cor);
    setEditando(false);
  }

  // pede confirmação e exclui
  function confirmarExclusao() {
    Alert.alert("Excluir peça", `Tem certeza que quer excluir "${peca.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: excluir },
    ]);
  }

  async function excluir() {
    try {
      await deleteDoc(doc(db, "pecas", id));
      navigation.goBack();
    } catch (erro) {
      console.log("Erro ao excluir:", erro);
      Alert.alert("Erro", "Não foi possível excluir a peça.");
    }
  }

 
  const nomeTipo = (idTipo) => TIPOS.find((t) => t.id === idTipo)?.nome ?? "-";
  const dadosCor = (idCor) => CORES.find((c) => c.id === idCor);

  if (carregando || !peca) {
    return <View style={estilos.centro}><ActivityIndicator size="large" /></View>;
  }

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Image source={{ uri: peca.foto }} style={estilos.foto} />

      {editando ? (
        
        <>
          <Text style={estilos.rotulo}>Nome</Text>
          <TextInput style={estilos.input} value={nome} onChangeText={setNome} />

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

          <Text style={estilos.rotulo}>Cor — {dadosCor(cor)?.nome}</Text>
          <View style={estilos.paleta}>
            {CORES.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[estilos.bolinha, { backgroundColor: c.hex }, cor === c.id && estilos.bolinhaSelecionada]}
                onPress={() => setCor(c.id)}
              />
            ))}
          </View>

          <TouchableOpacity style={estilos.botao} onPress={salvarEdicao} disabled={salvando}>
            {salvando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBotao}>Salvar alterações</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelarEdicao}>
            <Text style={estilos.link}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        // ===== MODO VISUALIZAÇÃO =====
        <>
          <Text style={estilos.titulo}>{peca.nome}</Text>

          <View style={estilos.infoLinha}>
            <Text style={estilos.infoRotulo}>Tipo</Text>
            <Text style={estilos.infoValor}>{nomeTipo(peca.tipo)}</Text>
          </View>

          <View style={estilos.infoLinha}>
            <Text style={estilos.infoRotulo}>Cor</Text>
            <View style={estilos.corValor}>
              <View style={[estilos.bolinhaPequena, { backgroundColor: dadosCor(peca.cor)?.hex }]} />
              <Text style={estilos.infoValor}>{dadosCor(peca.cor)?.nome}</Text>
            </View>
          </View>

          <TouchableOpacity style={estilos.botao} onPress={() => setEditando(true)}>
            <Text style={estilos.textoBotao}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[estilos.botao, estilos.botaoExcluir]} onPress={confirmarExclusao}>
            <Text style={estilos.textoBotao}>Excluir peça</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: "#fff" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center" },
  foto: { width: "100%", height: 340, borderRadius: 12, marginBottom: 16, backgroundColor: "#eee" },

  titulo: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  infoLinha: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  infoRotulo: { fontSize: 15, color: "#666" },
  infoValor: { fontSize: 15, fontWeight: "500" },
  corValor: { flexDirection: "row", alignItems: "center", gap: 8 },
  bolinhaPequena: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: "#ccc" },

  rotulo: { fontSize: 15, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, fontSize: 15 },
  linha: { flexDirection: "row", gap: 8 },
  opcao: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", alignItems: "center" },
  opcaoSelecionada: { backgroundColor: "#222", borderColor: "#222" },
  textoOpcao: { fontSize: 13, color: "#333" },
  textoSelecionado: { color: "#fff", fontWeight: "600" },
  paleta: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  bolinha: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: "#ccc" },
  bolinhaSelecionada: { borderWidth: 3, borderColor: "#222", transform: [{ scale: 1.1 }] },

  botao: { backgroundColor: "#222", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 20 },
  botaoExcluir: { backgroundColor: "#C62828", marginTop: 12 },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { textAlign: "center", color: "#555", fontSize: 15, padding: 12 },
});