import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Switch,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useConfig } from "./hooks/useConfig";
import Categories from "./pages/Categories";
import Checkout from "./pages/Checkout";
import Clients from "./pages/Clients";
import Configuration from "./pages/Configuration";
import Dashboard from "./pages/Dashboard";
import Discounts from "./pages/Discounts";
import AddBanner from "./pages/forms/banners/Add";
import EditBanner from "./pages/forms/banners/Edit";
import AddCategory from "./pages/forms/categories/Add";
import EditCategory from "./pages/forms/categories/Edit";
import AddCliente from "./pages/forms/clientes/Add";
import EditCliente from "./pages/forms/clientes/Edit";
import AddCupons from "./pages/forms/cupons/Add";
import EditCupons from "./pages/forms/cupons/Edit";
import AddOrder from "./pages/forms/orders/Add";
import EditOrder from "./pages/forms/orders/Edit";
import AddProduct from "./pages/forms/products/Add";
import EditProduct from "./pages/forms/products/Edit";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import MaintenceMode from "./pages/MaintenceMode";
import Menu from "./pages/Menu";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import PrivacyTerms from "./pages/PrivacyTerms";
import Product from "./pages/Product";
import Products from "./pages/Products";
import PromotionalBanners from "./pages/PromotionalCarrocel";
import Recovery from "./pages/Recovery";
import Registration from "./pages/Registration";
import StatusOrder from "./pages/StatusOrder";
import Terms from "./pages/Terms";

const ProtectedRoute = ({ element }) => {
  const { isLogged } = useAuth();

  return isLogged ? element : <Navigate to="/login" replace />;
};

function Routes() {
  const { config } = useConfig();

  if (config.isMaintence) {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact element={<MaintenceMode />} />
          <Route path="/cadastro" exact element={<Registration />} />
          <Route path="/recuperacao" exact element={<Recovery />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/acompanharPedido" exact element={<StatusOrder />} />
          <Route
            path="/inicio"
            exact
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/descontos"
            exact
            element={<ProtectedRoute element={<Discounts />} />}
          />
          <Route
            path="/clientes"
            exact
            element={<ProtectedRoute element={<Clients />} />}
          />
          <Route
            path="/produtos"
            exact
            element={<ProtectedRoute element={<Products />} />}
          />
          <Route
            path="/banners"
            exact
            element={<ProtectedRoute element={<PromotionalBanners />} />}
          />
          <Route
            path="/banners/adicionar"
            exact
            element={<ProtectedRoute element={<AddBanner />} />}
          />
          <Route
            path="/banners/editar"
            exact
            element={<ProtectedRoute element={<EditBanner />} />}
          />
          <Route
            path="/categorias"
            exact
            element={<ProtectedRoute element={<Categories />} />}
          />
          <Route
            path="/categorias/adicionar"
            exact
            element={<ProtectedRoute element={<AddCategory />} />}
          />
          <Route
            path="/categorias/editar"
            exact
            element={<ProtectedRoute element={<EditCategory />} />}
          />
          <Route
            path="/produtos/adicionar"
            exact
            element={<ProtectedRoute element={<AddProduct />} />}
          />
          <Route
            path="/produtos/editar"
            exact
            element={<ProtectedRoute element={<EditProduct />} />}
          />
          <Route
            path="/descontos/adicionar"
            exact
            element={<ProtectedRoute element={<AddCupons />} />}
          />
          <Route
            path="/descontos/editar"
            exact
            element={<ProtectedRoute element={<EditCupons />} />}
          />
          <Route
            path="/clientes/adicionar"
            exact
            element={<ProtectedRoute element={<AddCliente />} />}
          />
          <Route
            path="/clientes/editar"
            exact
            element={<ProtectedRoute element={<EditCliente />} />}
          />
          <Route
            path="/pedidos/adicionar"
            exact
            element={<ProtectedRoute element={<AddOrder />} />}
          />
          <Route
            path="/pedidos/editar"
            exact
            element={<ProtectedRoute element={<EditOrder />} />}
          />
          <Route
            path="/pedidos"
            exact
            element={<ProtectedRoute element={<Orders />} />}
          />
          <Route
            path="/configuracoes"
            exact
            element={<ProtectedRoute element={<Configuration />} />}
          />

          <Route path="*" element={<NotFound />} />
        </Switch>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/landing" exact element={<Landing />} />
        <Route path="/" exact element={<Home />} />
        <Route path="/listarProdutos" exact element={<Menu />} />
        <Route path="/pedido" exact element={<Checkout />} />
        <Route path="/produto" exact element={<Product />} />
        <Route path="/acompanharPedido" exact element={<StatusOrder />} />
        <Route path="/termos-e-condicoes" exact element={<Terms />} />
        <Route
          path="/politicas-de-privacidade"
          exact
          element={<PrivacyTerms />}
        />

        <Route path="/cadastro" exact element={<Registration />} />
        <Route path="/recuperacao" exact element={<Recovery />} />
        <Route path="/login" exact element={<Login />} />
        <Route
          path="/inicio"
          exact
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/descontos"
          exact
          element={<ProtectedRoute element={<Discounts />} />}
        />
        <Route
          path="/clientes"
          exact
          element={<ProtectedRoute element={<Clients />} />}
        />
        <Route
          path="/produtos"
          exact
          element={<ProtectedRoute element={<Products />} />}
        />
        <Route
          path="/banners"
          exact
          element={<ProtectedRoute element={<PromotionalBanners />} />}
        />
        <Route
          path="/banners/adicionar"
          exact
          element={<ProtectedRoute element={<AddBanner />} />}
        />
        <Route
          path="/banners/editar"
          exact
          element={<ProtectedRoute element={<EditBanner />} />}
        />
        <Route
          path="/categorias"
          exact
          element={<ProtectedRoute element={<Categories />} />}
        />
        <Route
          path="/categorias/adicionar"
          exact
          element={<ProtectedRoute element={<AddCategory />} />}
        />
        <Route
          path="/categorias/editar"
          exact
          element={<ProtectedRoute element={<EditCategory />} />}
        />
        <Route
          path="/produtos/adicionar"
          exact
          element={<ProtectedRoute element={<AddProduct />} />}
        />
        <Route
          path="/produtos/editar"
          exact
          element={<ProtectedRoute element={<EditProduct />} />}
        />
        <Route
          path="/descontos/adicionar"
          exact
          element={<ProtectedRoute element={<AddCupons />} />}
        />
        <Route
          path="/descontos/editar"
          exact
          element={<ProtectedRoute element={<EditCupons />} />}
        />
        <Route
          path="/clientes/adicionar"
          exact
          element={<ProtectedRoute element={<AddCliente />} />}
        />
        <Route
          path="/clientes/editar"
          exact
          element={<ProtectedRoute element={<EditCliente />} />}
        />
        <Route
          path="/pedidos/adicionar"
          exact
          element={<ProtectedRoute element={<AddOrder />} />}
        />
        <Route
          path="/pedidos/editar"
          exact
          element={<ProtectedRoute element={<EditOrder />} />}
        />
        <Route
          path="/pedidos"
          exact
          element={<ProtectedRoute element={<Orders />} />}
        />
        <Route
          path="/configuracoes"
          exact
          element={<ProtectedRoute element={<Configuration />} />}
        />

        <Route path="*" element={<NotFound />} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
