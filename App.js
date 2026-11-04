import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CameraScreen from "./src/screens/CameraScreen";
import LooksSalvos from "./src/screens/LooksSalvosScreen";
import CombinacaoCores from "./src/screens/CombinacaoCoresScreen";
import DetalhePeca from "./src/screens/DetalhePecaScreen";
import GuardaRoupa from "./src/screens/GuardaRoupaScreen";
import MontarLook from "./src/screens/MontarLookScreen";
import CadastrarPeca from "./src/screens/CadastrarPecaScreen";

const stack = createNativeStackNavigator();
const tabs = createBottomTabNavigator();

function Abas() {
  return (
    <tabs.Navigator>
      <tabs.Screen name="GuardaRoupa" component={GuardaRoupa} options={{ title: "Guarda-roupa" }} />
      <tabs.Screen name="Camera" component={CameraScreen} options={{ title: "Câmera" }} />
      <tabs.Screen name="MontarLook" component={MontarLook} options={{ title: "Montar look" }} />
      <tabs.Screen name="LooksSalvos" component={LooksSalvos} options={{ title: "Looks" }} />
      <tabs.Screen name="CombinacaoCores" component={CombinacaoCores} options={{ title: "Cores" }} />
    </tabs.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
        <stack.Screen name="CadastrarPeca" component={CadastrarPeca} options={{ title: "Cadastrar peça" }} />
        <stack.Screen name="DetalhePeca" component={DetalhePeca} options={{ title: "Detalhe da peça" }} />
      </stack.Navigator>
    </NavigationContainer>
  );
}