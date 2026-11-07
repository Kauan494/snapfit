import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";

export default function CameraScreen({navigation}){
  //Permissão da câmera
  const [permissao,pedirPermissao] = useCameraPermissions();

  //Ref para conseguir fazer a câmera tirar ft
  const cameraRef = useRef(null);

  //Foto tirada
  const [foto,setFoto] = useState(null);

  //Mosra um carregando enqt a ft é processada
  const [tirando, setTirando] = useState(false);

  if(!permissao){
    return <View style={estilos.centro}><ActivityIndicator size="large"/></View>
  }

  if(!permissao.granted){
    return(
      <View style={estilos.centro}>
        <Text style={estilos.texto}>Precisamos da câmera para tirar foto da suas roupas.</Text>
        <TouchableOpacity style={estilos.botao} onPress={pedirPermissao}>
          <Text style={estilos.textoBotao}>Permitir câmera</Text>
        </TouchableOpacity>
      </View>
    );
  }
    // Tira a foto, vibra e guarda no estado
  async function tirarFoto() {
    if (!cameraRef.current || tirando) return;
    setTirando(true);
    try {
      const resultado = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setFoto(resultado);
    } catch (erro) {
      console.log("Erro ao tirar foto:", erro);
    } finally {
      setTirando(false);
    }
  }

  // 3) Já tem foto: mostra a prévia e as opções
  if (foto) {
    return (
      <View style={estilos.container}>
        <Image source={{ uri: foto.uri }} style={estilos.previa} />

        <View style={estilos.areaBotoes}>
          <TouchableOpacity
            style={estilos.botao}
            onPress={() => { 
              setFoto(null);
              navigation.navigate("CadastrarPeca", { fotoUri: foto.uri })
            }}
          >
            <Text style={estilos.textoBotao}>Salvar no guarda-roupa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[estilos.botao, estilos.botaoSecundario]}
            onPress={() => {
              setFoto(null);
              navigation.navigate("MontarLook", { fotoUri: foto.uri })
            }}
          >
            <Text style={estilos.textoBotao}>Usar no look agora</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFoto(null)}>
            <Text style={estilos.link}>Tirar outra</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 4) Sem foto: mostra a câmera ao vivo
  return (
    <View style={estilos.container}>
      <CameraView ref={cameraRef} style={estilos.camera} facing="back" />

      <View style={estilos.areaCaptura}>
        <TouchableOpacity style={estilos.botaoCaptura} onPress={tirarFoto} disabled={tirando}>
          {tirando ? <ActivityIndicator color="#000" /> : <View style={estilos.miolo} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centro: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  texto: { fontSize: 16, textAlign: "center", marginBottom: 16 },
  camera: { flex: 1 },

  // Botão redondo de tirar foto
  areaCaptura: { position: "absolute", bottom: 32, width: "100%", alignItems: "center" },
  botaoCaptura: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: "#fff", justifyContent: "center", alignItems: "center",
  },
  miolo: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: "#000" },

  // Prévia da foto
  previa: { flex: 1, resizeMode: "contain" },
  areaBotoes: { padding: 16, gap: 12, backgroundColor: "#fff" },
  botao: { backgroundColor: "#222", padding: 14, borderRadius: 10, alignItems: "center" },
  botaoSecundario: { backgroundColor: "#555" },
  textoBotao: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { textAlign: "center", color: "#555", fontSize: 15, padding: 4 },

});