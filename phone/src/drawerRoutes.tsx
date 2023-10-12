import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./components/CustomDrawer";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Item from "./screens/Item";
import Products from "./screens/Products";
import Checkout from "./screens/Checkout";
import StatusOrder from "./screens/StatusOrder";

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Products" component={Products} />
      <Drawer.Screen name="Item" component={Item} />
      <Drawer.Screen name="Login" component={Login} />
      <Drawer.Screen name="Checkout" component={Checkout} />
      <Drawer.Screen name="StatusOrder" component={StatusOrder} />
    </Drawer.Navigator>
  );
}
