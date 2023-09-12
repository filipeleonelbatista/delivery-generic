import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContextProvider } from "./contexts/AuthContext";
import { BannersContextProvider } from "./contexts/BannersContext";
import { CategoriesContextProvider } from "./contexts/CategoriesContext";
import { ClientesContextProvider } from "./contexts/ClientesContext";
import { ConfigsContextProvider } from "./contexts/ConfigsContext";
import { CuponsContextProvider } from "./contexts/CuponsContext";
import { LoaderContextProvider } from "./contexts/LoaderContext";
import { OrderContextProvider } from "./contexts/OrderContext";
import { ProductsContextProvider } from "./contexts/ProductContext";
import { ToastContextProvider } from "./contexts/ToastContext";
import Routes from "./Routes";
import "./styles/styles.css";

import { register } from "swiper/element/bundle";
import { ShoppingCartContextProvider } from "./contexts/ShoppingCartContext";
register();

const theme = createTheme({
  palette: {
    primary: {
      main: "#f20530",
      dark: "#8c030e",
      light: "#f22e52",
      contrastText: "#FFF",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
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
                            <CssBaseline />
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
    </ThemeProvider>
  );
}

export default App;
