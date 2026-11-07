import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  TextInput, Alert, ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Accelerometer } from "expo-sensors";
import * as Haptics from "expo-haptics";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { CORES, TIPOS } from "../data/cores";
import { combinam, lookCombina } from "../utils/combinacao";
import { prepararFoto } from "../utils/imagem";

const LOOK_VAZIO = { cima: null, baixo: null, calcado: null };


function embaralhar(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

export default function MontarLook({ route, navigation }) {
  const [pecas, setPecas] = useState([]);
  const [look, setLook] = useState(LOOK_VAZIO);
  const [espacoAberto, setEspacoAberto] = useState(null);
  const [nomeLook, setNomeLook] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Cópia das peças numa ref, para o sensor sempre enxergar a lista atual
  const pecasRef = useRef([]);


  useEffect(() => {
    const pararDeLer = onSnapshot(collection(db, "pecas"), (snapshot) => {
      const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPecas(lista);
      pecasRef.current = lista;
    });
    return pararDeLer;
  }, []);

  // Recebe a foto enviada pela câmera ("Usar no look agora")
  useEffect(() => {
    const fotoUri = route.params?.fotoUri;
    if (!fotoUri) return;

    Alert.alert(
      "Usar foto no look",
      "Essa peça é de qual parte?",
      TIPOS.map((t) => ({
        text: t.nome,
        onPress: () =>
          setLook((atual) => ({
            ...atual,
            [t.id]: { temporaria: true, foto: fotoUri, nome: "Foto da câmera", cor: null },
          })),
      })),
      { cancelable: true }
    );

    
    navigation.setParams({ fotoUri: undefined });
  }, [route.params?.fotoUri]);

  // Sorteia um look em que todas as peças combinam
  function sortearLook() {
    const lista = pecasRef.current;
    const cimas = embaralhar(lista.filter((p) => p.tipo === "cima"));
    const baixos = lista.filter((p) => p.tipo === "baixo");
    const calcados = lista.filter((p) => p.tipo === "calcado");

    if (!cimas.length || !baixos.length || !calcados.length) {
      Alert.alert("Faltam peças", "Cadastre pelo menos uma parte de cima, uma de baixo e um calçado.");
      return;
    }

    for (const cima of cimas) {
      const baixosQueCombinam = embaralhar(baixos.filter((b) => combinam(cima.cor, b.cor)));

      for (const baixo of baixosQueCombinam) {
        const calcadosQueCombinam = calcados.filter(
          (c) => combinam(c.cor, cima.cor) && combinam(c.cor, baixo.cor)
        );

        if (calcadosQueCombinam.length > 0) {
          const calcado = calcadosQueCombinam[Math.floor(Math.random() * calcadosQueCombinam.length)];
          setLook({ cima, baixo, calcado });
          setEspacoAberto(null);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return;
        }
      }
    }

    Alert.alert("Sem combinação", "Não encontrei um look que combine. Cadastre mais peças!");
  }

  // ACELERÔMETRO: detecta quando o celular é agitado (só com a tela aberta)
  useFocusEffect(
    useCallback(() => {
      let ultimaAgitada = 0;
      Accelerometer.setUpdateInterval(150);

      const assinatura = Accelerometer.addListener(({ x, y, z }) => {
        const forca = Math.sqrt(x * x + y * y + z * z);
        const agora = Date.now();

        // Parado, a força fica perto de 1 (a gravidade). Acima de 1.8 = agitou
        if (forca > 1.8 && agora - ultimaAgitada > 1500) {
          ultimaAgitada = agora;
          sortearLook();
        }
      });

      // Ao sair da tela, desliga o sensor
      return () => assinatura.remove();
    }, [])
  );

  // Escolhe uma peça para um espaço
  function escolherPeca(tipo, peca) {
    setLook((atual) => ({ ...atual, [tipo]: peca }));
    setEspacoAberto(null);
    Haptics.selectionAsync();
  }

  function removerPeca(tipo) {
    setLook((atual) => ({ ...atual, [tipo]: null }));
    setEspacoAberto(null);
  }

  // CREATE: salva o look na coleção "looks"
  async function salvarLook() {
    if (!look.cima || !look.baixo || !look.calcado) {
      Alert.alert("Look incompleto", "Escolha a parte de cima, a de baixo e o calçado.");
      return;
    }
    if (!nomeLook.trim()) {
      Alert.alert("Dê um nome", "Escreva um nome para o look.");
      return;
    }

    setSalvando(true);
    try {
      const itens = [];
      for (const tipo of ["cima", "baixo", "calcado"]) {
        const peca = look[tipo];
        itens.push({
          tipo,
          pecaId: peca.temporaria ? null : peca.id,
          nome: peca.nome,
          cor: peca.cor ?? null,
          // Foto da câmera ainda está grande, então reduz antes de salvar
          foto: peca.temporaria ? await prepararFoto(peca.foto) : peca.foto,
        });
      }

      await addDoc(collection(db, "looks"), {
        nome: nomeLook.trim(),
        itens,
        combina: lookCombina(itens),
        criadoEm: serverTimestamp(),
      });

      Alert.alert("Look salvo!", "Você pode ver ele em Looks salvos.");
      setLook(LOOK_VAZIO);
      setNomeLook("");
      navigation.navigate("LooksSalvos");
    } catch (erro) {
      console.log("Erro ao salvar look:", erro);
      Alert.alert("Erro", "Não foi possível salvar o look.");
    } finally {
      setSalvando(false);
    }
  }

  // Aviso se as cores escolhidas combinam
  const pecasEscolhidas = Object.values(look).filter(Boolean);
  const mostrarAviso = pecasEscolhidas.length >= 2;
  const combinaTudo = lookCombina(pecasEscolhidas);

  const dadosCor = (id) => CORES.find((c) => c.id === id);

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <Text style={estilos.titulo}>Monte seu look</Text>
      <Text style={estilos.subtitulo}>Toque em cada parte para escolher, ou agite o celular para sortear 🎲</Text>

      {/* Os 3 espaços do look */}
      {TIPOS.map((tipo) => {
        const peca = look[tipo.id];
        const aberto = espacoAberto === tipo.id;
        const opcoes = pecas.filter((p) => p.tipo === tipo.id);

        return (
          <View key={tipo.id} style={estilos.blocoEspaco}>
            <TouchableOpacity
              style={[estilos.espaco, aberto && estilos.espacoAberto]}
              onPress={() => setEspacoAberto(aberto ? null : tipo.id)}
            >
              {peca ? (
                <>
                  <Image source={{ uri: peca.foto }} style={estilos.fotoEspaco} />
                  <View style={estilos.infoEspaco}>
                    <Text style={estilos.tipoEspaco}>{tipo.nome}</Text>
                    <Text style={estilos.nomeEspaco} numberOfLines={1}>{peca.nome}</Text>
                    {peca.cor && (
                      <View style={estilos.linhaCor}>
                        <View style={[estilos.bolinha, { backgroundColor: dadosCor(peca.cor)?.hex }]} />
                        <Text style={estilos.textoCor}>{dadosCor(peca.cor)?.nome}</Text>
                      </View>
                    )}
                  </View>
                </>
              ) : (
                <Text style={estilos.vazioEspaco}>+ {tipo.nome}</Text>
              )}
            </TouchableOpacity>

            {/* Lista de peças para escolher */}
            {aberto && (
              <View style={estilos.seletor}>
                {opcoes.length === 0 ? (
                  <Text style={estilos.semOpcoes}>Nenhuma peça desse tipo no guarda-roupa.</Text>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.listaOpcoes}>
                    {opcoes.map((p) => (
                      <TouchableOpacity key={p.id} onPress={() => escolherPeca(tipo.id, p)}>
                        <Image
                          source={{ uri: p.foto }}
                          style={[estilos.fotoOpcao, peca?.id === p.id && estilos.fotoOpcaoSelecionada]}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
                {peca && (
                  <TouchableOpacity onPress={() => removerPeca(tipo.id)}>
                    <Text style={estilos.remover}>Remover peça</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );
      })}

      {/* Aviso de combinação */}
      {mostrarAviso && (
        <View style={[estilos.aviso, combinaTudo ? estilos.avisoOk : estilos.avisoAlerta]}>
          <Text style={estilos.textoAviso}>
            {combinaTudo ? "✅ As cores desse look combinam!" : "⚠️ Essas cores podem não combinar."}
          </Text>
        </View>
      )}

      {/* Ações */}
      <TouchableOpacity style={[estilos.botao, estilos.botaoSecundario]} onPress={sortearLook}>
        <Text style={estilos.textoBotao}>🎲 Sortear look</Text>
      </TouchableOpacity>

      <TextInput
        style={estilos.input}
        placeholder="Nome do look (ex.: Rolê de sábado)"
        value={nomeLook}
        onChangeText={setNomeLook}
      />

      <TouchableOpacity style={estilos.botao} onPress={salvarLook} disabled={salvando}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBotao}>Salvar look</Text>}
      </TouchableOpacity>

      {pecasEscolhidas.length > 0 && (
        <TouchableOpacity onPress={() => { setLook(LOOK_VAZIO); setEspacoAberto(null); }}>
          <Text style={estilos.remover}>Limpar look</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "700" },
  subtitulo: { fontSize: 14, color: "#666", marginTop: 4, marginBottom: 16 },

  blocoEspaco: { marginBottom: 12 },
  espaco: {
    flexDirection: "row", alignItems: "center", minHeight: 110,
    borderWidth: 1.5, borderColor: "#ddd", borderStyle: "dashed", borderRadius: 12,
    padding: 10, gap: 12,
  },
  espacoAberto: { borderColor: "#222", borderStyle: "solid" },
  fotoEspaco: { width: 80, height: 90, borderRadius: 8, backgroundColor: "#eee" },
  infoEspaco: { flex: 1 },
  tipoEspaco: { fontSize: 12, color: "#888" },
  nomeEspaco: { fontSize: 16, fontWeight: "600", marginTop: 2 },
  linhaCor: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  bolinha: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: "#ccc" },
  textoCor: { fontSize: 13, color: "#555" },
  vazioEspaco: { flex: 1, textAlign: "center", fontSize: 16, color: "#999" },

  seletor: { paddingTop: 10 },
  listaOpcoes: { gap: 8 },
  fotoOpcao: { width: 70, height: 85, borderRadius: 8, backgroundColor: "#eee", borderWidth: 2, borderColor: "transparent" },
  fotoOpcaoSelecionada: { borderColor: "#222" },
  semOpcoes: { fontSize: 13, color: "#999" },
  remover: { textAlign: "center", color: "#C62828", fontSize: 14, padding: 10 },

  aviso: { padding: 12, borderRadius: 10, marginTop: 4, marginBottom: 4 },
  avisoOk: { backgroundColor: "#E8F5E9" },
  avisoAlerta: { backgroundColor: "#FFF3E0" },
  textoAviso: { fontSize: 14, fontWeight: "600", textAlign: "center" },

  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, fontSize: 15, marginTop: 16 },
  botao: { backgroundColor: "#222", padding: 16, borderRadius: 10, alignItems: "center", marginTop: 12 },
  botaoSecundario: { backgroundColor: "#555" },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600" },
});