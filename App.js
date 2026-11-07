import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Intro from "./src/components/Intro";
import Capa from "./src/screens/CapaScreen";
import CameraScreen from "./src/screens/CameraScreen";
import LooksSalvos from "./src/screens/LooksSalvosScreen";
import CombinacaoCores from "./src/screens/CombinacaoCoresScreen";
import DetalhePeca from "./src/screens/DetalhePecaScreen";
import GuardaRoupa from "./src/screens/GuardaRoupaScreen";
import MontarLook from "./src/screens/MontarLookScreen";
import CadastrarPeca from "./src/screens/CadastrarPecaScreen";

const stack = createNativeStackNavigator();
const tabs = createBottomTabNavigator();

const ICONES = {
  GuardaRoupa: "shirt",
  Camera: "camera",
  MontarLook: "sparkles",
  LooksSalvos: "bookmark",
  CombinacaoCores: "color-palette",
};

function Abas() {
  return (
    <tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? ICONES[route.name] : `${ICONES[route.name]}-outline`}
            size={size}
            color={color}
          />
        ),
        tabBarActiveTintColor: "#222",
        tabBarInactiveTintColor: "#999",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: { backgroundColor: "#fff", borderTopColor: "#eee" },
        headerTitle: () => <Intro />,
        headerTitleAlign: "left",
        headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: false,
      })}
    >
      <tabs.Screen name="GuardaRoupa" component={GuardaRoupa} options={{ title: "Guarda-roupa" }} />
      <tabs.Screen name="Camera" component={CameraScreen} options={{ title: "Câmera", headerShown: false }} />
      <tabs.Screen name="MontarLook" component={MontarLook} options={{ title: "Montar look" }} />
      <tabs.Screen name="LooksSalvos" component={LooksSalvos} options={{ title: "Looks" }} />
      <tabs.Screen name="CombinacaoCores" component={CombinacaoCores} options={{ title: "Cores" }} />
    </tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator
        initialRouteName="Capa"
        screenOptions={{
          headerTintColor: "#222",
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
          headerBackTitle: "Voltar",
        }}
      >
        <stack.Screen name="Capa" component={Capa} options={{ headerShown: false }} />
        <stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
        <stack.Screen name="CadastrarPeca" component={CadastrarPeca} options={{ title: "Cadastrar peça" }} />
        <stack.Screen name="DetalhePeca" component={DetalhePeca} options={{ title: "Detalhe da peça" }} />
      </stack.Navigator>
    </NavigationContainer>
  );
}