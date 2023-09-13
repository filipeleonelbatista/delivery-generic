import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./components/CustomDrawer";
import Home from "./screens/Home";
import Login from "./screens/Login";

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
}
