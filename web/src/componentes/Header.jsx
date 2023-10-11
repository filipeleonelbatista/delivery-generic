import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
// import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import { useConfig } from "../hooks/useConfig";
import { useCategories } from "../hooks/useCategories";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";
import NoData from "./NoData";
import { cutStringToMaxValue } from "../utils/string";

function Header({ hideOption = false }) {
  const {
    productsList,
    totalShoppingCart,
    handleRemoveProductFromCart,
    updateQuantity,
  } = useShoppingCart();
  const { config } = useConfig();
  const navigate = useNavigate();
  const theme = useTheme();

  const { categoriesList } = useCategories();

  const sections = React.useMemo(() => {
    const response = categoriesList.filter((item) => item.active);
    return response;
  }, [categoriesList]);

  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
        {!hideOption && (
          <Button
            sx={{ display: { xs: "none", sm: "flex" } }}
            onClick={() => navigate("/listarProdutos")}
            size="small"
          >
            {config.listOptionMenuName ?? "Menu"}
          </Button>
        )}

        {config.useLogoInHeader ? (
          <Box
            sx={{
              textDecoration: "none",
              flex: 1,
              display: "flex",
              justifyContent: { xs: "flex-start", sm: "center" },
            }}
          >
            <Link style={{ textDecoration: "none" }} to="/" title={config.name}>
              <CardMedia
                component="img"
                sx={{ maxWidth: 150, maxHeight: 50 }}
                image={config.logo}
              />
            </Link>
          </Box>
        ) : (
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            noWrap
            sx={{
              flex: 1,
              textAlign: { xs: "flex-start", sm: "center" },
              '& > a':{
                color: (theme) => theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: 'bold',
              }
            }}
            title={config.name}
          >
            <Link sx={{ textDecoration: "none" }} to="/">
              {config.name}
            </Link>
          </Typography>
        )}
        {/* <IconButton>
          <SearchIcon />
        </IconButton> */}
        {!hideOption && (
          <>
            <Button
              id="shopping-cart-button-open-drawer"
              onClick={() => setOpen(true)}
              startIcon={<ShoppingBagIcon />}
              variant="outlined"
              size="small"
            >
              <Typography>{formatCurrency(totalShoppingCart)}</Typography>
            </Button>
            <SwipeableDrawer
              anchor={"right"}
              open={open}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
            >
              <Box
                sx={{
                  width: { xs: 280, sm: 380 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  gap: 2,
                  position: "relative",
                }}
                role="presentation"
                onKeyDown={() => setOpen(false)}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                  }}
                  aria-label="delete"
                  size="large"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h5">Seu Pedido</Typography>
                <Divider />

                {productsList.length > 0 ? (
                  productsList.map((product, index) => (
                    <Card
                      key={product.id}
                      sx={{
                        display: "flex",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          backgroundColor: (theme) =>
                            theme.palette.primary.main,
                          color: "white",
                          "&:hover": {
                            background: (theme) => theme.palette.primary.dark,
                          },
                        }}
                        size="small"
                        aria-label="delete"
                        onClick={() => handleRemoveProductFromCart(index)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                      <CardContent
                        sx={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Typography component="h2" variant="body1">
                          {product.productObject.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.quantity} X{" "}
                          {formatCurrency(product.unityAmount)}
                        </Typography>
                        <Typography variant="caption">
                          {cutStringToMaxValue(
                            product.productObject.description
                          )}
                        </Typography>
                        <Stack direction={"row"} spacing={2}>
                          <IconButton
                            sx={{
                              backgroundColor: (theme) =>
                                theme.palette.primary.main,
                              color: "white",
                              "&:hover": {
                                background: (theme) =>
                                  theme.palette.primary.dark,
                              },
                            }}
                            size="small"
                            aria-label="delete"
                            onClick={() => updateQuantity(index, "adicionar")}
                          >
                            <AddIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton
                            sx={{
                              backgroundColor: (theme) =>
                                theme.palette.primary.main,
                              color: "white",
                              "&:hover": {
                                background: (theme) =>
                                  theme.palette.primary.dark,
                              },
                            }}
                            size="small"
                            aria-label="delete"
                            onClick={() => updateQuantity(index, "remover")}
                          >
                            <RemoveIcon fontSize="inherit" />
                          </IconButton>
                        </Stack>
                      </CardContent>
                      <CardMedia
                        component="img"
                        sx={{
                          width: { xs: 80, sm: 130 },
                          height: { xs: 156, sm: 156 },
                          display: { sm: "block" },
                        }}
                        image={product.productObject.featuredImage}
                        alt={product.productObject.name}
                      />
                    </Card>
                  ))
                ) : (
                  <NoData
                    primaryColor={theme.palette.primary.main}
                    description={
                      <Stack direction="column" spacing={4} maxWidth={300}>
                        <Typography variant="body2" textAlign="center">
                          Sem produtos cadastrados no momento. Adicione produtos
                          ao carrinho de compras e eles aparecerão aqui
                        </Typography>
                      </Stack>
                    }
                    style={{
                      width: 180,
                      height: 180,
                    }}
                  />
                )}

                {productsList.length > 0 && (
                  <>
                    <Divider />
                    <Stack
                      sx={{ width: "100%", my: 2 }}
                      justifyContent="space-between"
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Typography variant="body1">Subtotal:</Typography>
                      <Typography variant="body1" font>
                        {formatCurrency(totalShoppingCart)}
                      </Typography>
                    </Stack>

                    <Button
                      onClick={() => navigate("/pedido")}
                      variant="contained"
                      fullWidth
                      sx={{ borderRadius: 8 }}
                    >
                      Finalizar pedido
                    </Button>
                  </>
                )}
              </Box>
            </SwipeableDrawer>
          </>
        )}
      </Toolbar>
      {!hideOption && sections.length > 0 && (
        <Toolbar
          component="nav"
          variant="dense"
          sx={{ justifyContent: "space-between", overflowX: "auto" }}
        >
          {sections.map((section) => (
            <Link
              key={section.id}
              style={{
                textDecoration: "none",
                color: theme.palette.primary.main,
              }}
              to={`/listarProdutos?category=${section.id}`}
            >
              <Typography
                color="inherit"
                noWrap
                variant="body2"
                sx={{ p: 1, flexShrink: 0 }}
              >
                {section.name}
              </Typography>
            </Link>
          ))}
        </Toolbar>
      )}
    </React.Fragment>
  );
}

export default Header;
