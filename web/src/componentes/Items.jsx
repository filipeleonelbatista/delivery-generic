import { Box, Button, CardMedia, IconButton, Stack } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/system";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { formatCurrency } from "../utils/formatCurrency";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import NoData from "./NoData";

export default function Items({ handleBack, handleNext, activeStep, steps }) {
  const {
    productsList,
    totalShoppingCart,
    handleRemoveProductFromCart,
    updateQuantity,
  } = useShoppingCart();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Produtos
      </Typography>
      <List disablePadding>
        {productsList.length > 0 ? (
          productsList.map((product, index) => (
            <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
              <IconButton
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: "white",
                  "&:hover": {
                    background: (theme) => theme.palette.primary.dark,
                  },
                  mr: 1,
                }}
                size="small"
                aria-label="delete"
                onClick={() => handleRemoveProductFromCart(index)}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
              <CardMedia
                component="img"
                sx={{
                  width: { xs: 70 },
                  height: { xs: 70 },
                  display: { sm: "block" },
                  mr: 1,
                }}
                image={product.productObject.featuredImage}
                alt={product.productObject.name}
              />
              <ListItemText
                primary={product.productObject.name}
                secondary={`${product.quantity} x ${formatCurrency(
                  product.unityAmount
                )}`}
              />
              <Stack
                sx={{ width: 80, justifyContent: "center" }}
                alignItems="flex-end"
                direction={"row"}
                spacing={1}
              >
                <IconButton
                  sx={{
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      background: (theme) => theme.palette.primary.dark,
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
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      background: (theme) => theme.palette.primary.dark,
                    },
                  }}
                  size="small"
                  aria-label="delete"
                  onClick={() => updateQuantity(index, "remover")}
                >
                  <RemoveIcon fontSize="inherit" />
                </IconButton>
              </Stack>

              <ListItemText
                sx={{
                  textAlign: "end",
                }}
                primary={`${formatCurrency(
                  product.quantity * product.unityAmount
                )}`}
              />
              <Typography variant="body2">{product.price}</Typography>
            </ListItem>
          ))
        ) : (
          <NoData
            primaryColor={theme.palette.primary.main}
            description={
              <Stack direction="column" spacing={4} maxWidth={300}>
                <Typography variant="body2" textAlign="center">
                  Sem produtos cadastrados no momento. Adicione produtos ao
                  carrinho de compras e eles aparecerão aqui
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/listarProdutos")}
                >
                  Ir para produtos
                </Button>
              </Stack>
            }
            style={{
              width: 180,
              height: 180,
            }}
          />
        )}
        {productsList.length > 0 && (
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {formatCurrency(totalShoppingCart)}
            </Typography>
          </ListItem>
        )}
      </List>

      {productsList.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
              Voltar
            </Button>
          )}

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{ mt: 3, ml: 1 }}
          >
            {activeStep === steps.length - 1 ? "Enviar pedido" : "Próximo"}
          </Button>
        </Box>
      )}
    </React.Fragment>
  );
}
