import { ImageManipulator, SaveFormat } from "expo-image-manipulator";


export async function prepararFoto(uri) {
  const contexto = ImageManipulator.manipulate(uri);
  contexto.resize({ width: 600 });
  const imagem = await contexto.renderAsync();
  const resultado = await imagem.saveAsync({
    compress: 0.5,
    format: SaveFormat.JPEG,
    base64: true,
  });
  return "data:image/jpeg;base64," + resultado.base64;
}