import AppsIcon from "@mui/icons-material/Apps";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import PercentIcon from "@mui/icons-material/Percent";
import SettingsIcon from "@mui/icons-material/Settings";
import ViewListIcon from "@mui/icons-material/ViewList";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Copyright from "./Copyright";

import {
  CardMedia,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SEO from "./SEO";
import { useConfig } from "../hooks/useConfig";

import defaultFavicon from "../assets/defaultFavicon.png";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function DrawerComponent(props) {
  const { logout, isMenuHide, setIsMenuHide } = useAuth();
  const { config } = useConfig();

  const toggleDrawer = () => {
    setIsMenuHide(!isMenuHide);
    localStorage.setItem("@isMenuHide", JSON.stringify(!isMenuHide));
  };

  const navigate = useNavigate();

  const handleNavigate = (text) => {
    return navigate(text);
  };

  return (
    <Box component="main" sx={{ display: "flex" }}>
      <SEO title={props.title} />
      <AppBar position="absolute" open={isMenuHide}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(isMenuHide && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={isMenuHide}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "flex-start",
              width: "100%",
              pl: 2,
            }}
          >
            <Box
              sx={{
                textDecoration: "none",
                display: "flex",
              }}
            >
              <Link
                style={{ textDecoration: "none" }}
                to="/inicio"
                title={config.name}
              >
                <CardMedia
                  component="img"
                  sx={{ maxWidth: 30, maxHeight: 30 }}
                  image={config.logo ?? defaultFavicon}
                />
              </Link>
            </Box>
            {false && <WhatsAppIcon />}
            <Typography><b>{config.name ?? "FoodDelivery"}</b></Typography>
          </Box>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <Tooltip placement="right" title="Inicio">
            <ListItemButton
              selected={location.pathname === "/inicio"}
              onClick={() => handleNavigate("/inicio")}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Inicio" />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="right" title="Pedidos">
            <ListItemButton
              selected={location.pathname === "/pedidos"}
              onClick={() => handleNavigate("/pedidos")}
            >
              <ListItemIcon>
                <ViewListIcon />
              </ListItemIcon>
              <ListItemText primary="Pedidos" />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="right" title="Clientes">
            <ListItemButton
              selected={location.pathname === "/clientes"}
              onClick={() => handleNavigate("/clientes")}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Clientes" />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="right" title="Cupons">
            <ListItemButton
              selected={location.pathname === "/descontos"}
              onClick={() => handleNavigate("/descontos")}
            >
              <ListItemIcon>
                <PercentIcon />
              </ListItemIcon>
              <ListItemText primary="Cupons" />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="right" title="Produtos">
            <ListItemButton
              selected={location.pathname === "/produtos"}
              onClick={() => handleNavigate("/produtos")}
            >
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Produtos" />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="right" title="Categorias">
            <ListItemButton
              selected={location.pathname === "/categorias"}
              onClick={() => handleNavigate("/categorias")}
            >
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              <ListItemText primary="Categorias" />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="right" title="Banners">
            <ListItemButton
              selected={location.pathname === "/banners"}
              onClick={() => handleNavigate("/banners")}
            >
              <ListItemIcon>
                <ViewListIcon />
              </ListItemIcon>
              <ListItemText primary="Banners" />
            </ListItemButton>
          </Tooltip>
          <Divider sx={{ my: 1 }} />
          <Tooltip placement="right" title="Configurações">
            <ListItemButton
              selected={location.pathname === "/configuracoes"}
              onClick={() => handleNavigate("/configuracoes")}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configurações" />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="right" title="Sair">
            <ListItemButton
              selected={location.pathname === "/"}
              onClick={() => {
                if (window.confirm("Deseja realmente sair do sistema?")) {
                  logout();
                  handleNavigate("/");
                }
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </Tooltip>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: !!props.header ? 0 : 4, mb: 4 }}>
          {!!props.header && (
            <Box
              sx={{
                w: "100%",
                py: 2,
              }}
            >
              {props.header}
            </Box>
          )}
          <Box
            sx={{
              w: "100%",
              borderRadius: 2,
              p: 4,
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? "#FFF"
                  : theme.palette.grey[800],
            }}
          >
            {props.children}
          </Box>
          <Copyright color="gray.800" />
        </Container>
      </Box>
    </Box>
  );
}
