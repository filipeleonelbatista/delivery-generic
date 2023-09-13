import "react-native-gesture-handler";
import { Box, GluestackUIProvider } from "@gluestack-ui/themed";
import { StatusBar } from "expo-status-bar";
import { LogBox, StatusBar as RNStatusBar } from "react-native";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { BannersContextProvider } from "./src/contexts/BannersContext";
import { CategoriesContextProvider } from "./src/contexts/CategoriesContext";
import { ClientesContextProvider } from "./src/contexts/ClientesContext";
import { ConfigsContextProvider } from "./src/contexts/ConfigsContext";
import { CuponsContextProvider } from "./src/contexts/CuponsContext";
import { LoaderContextProvider } from "./src/contexts/LoaderContext";
import { OrderContextProvider } from "./src/contexts/OrderContext";
import { ProductsContextProvider } from "./src/contexts/ProductContext";
import { ShoppingCartContextProvider } from "./src/contexts/ShoppingCartContext";
import { ToastContextProvider } from "./src/contexts/ToastContext";
import Routes from "./src/routes";

export default function App() {
  return (
    <>
      <GluestackUIProvider>
        <LoaderContextProvider>
          <ToastContextProvider>
            <ConfigsContextProvider>
              <AuthContextProvider>
                <ClientesContextProvider>
                  <BannersContextProvider>
                    <CategoriesContextProvider>
                      <ProductsContextProvider>
                        <CuponsContextProvider>
                          <OrderContextProvider>
                            <ShoppingCartContextProvider>
                              <Box
                                bg={"$red600"}
                                height={RNStatusBar.currentHeight}
                              >
                                <StatusBar style="light" />
                              </Box>
                              <Routes />
                            </ShoppingCartContextProvider>
                          </OrderContextProvider>
                        </CuponsContextProvider>
                      </ProductsContextProvider>
                    </CategoriesContextProvider>
                  </BannersContextProvider>
                </ClientesContextProvider>
              </AuthContextProvider>
            </ConfigsContextProvider>
          </ToastContextProvider>
        </LoaderContextProvider>
      </GluestackUIProvider>
    </>
  );
}
