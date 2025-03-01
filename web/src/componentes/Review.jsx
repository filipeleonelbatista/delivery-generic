import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useMemo } from "react";

import {
  Box,
  Button,
  CardMedia,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { formatCurrency } from "../utils/formatCurrency";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import { useConfig } from "../hooks/useConfig";
import { useToast } from "../hooks/useToast";
import { calcularDistancia } from "../utils/calcularDistancia";
import NoData from "./NoData";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Review({ handleBack, handleNext, activeStep, steps }) {
  const {
    productsList,
    totalShoppingCart,
    handleRemoveProductFromCart,
    updateQuantity,
    userInfo,
    selectedPaymentMethod,
    isDelivery,
    cupom,
    createOrderFromSite,
    change
  } = useShoppingCart();

  const { config } = useConfig();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const theme = useTheme();

  const [coords, setCoords] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCoords({ lat: latitude, lng: longitude });
    });
  }, []);

  const dinamicDeliveryValue = useMemo(() => {
    if (isDelivery === "Retirada") {
      return 0;
    }
    if (coords) {
      const distance = calcularDistancia(config.location, coords);
      const result = distance * config.deliveryTaxValue;
      return result > config.deliveryTaxValue
        ? result
        : config.deliveryTaxValue;
    }
    return 0;
  }, [coords]);

  const dinamicCupomValue = useMemo(() => {
    if (cupom) {
      if (cupom.isDelivery) {
        return dinamicDeliveryValue - cupom.valueDiscount ?? 0;
      } else if (cupom.isFreeDelivery) {
        return dinamicDeliveryValue ?? 0;
      } else if (cupom.isPercentage) {
        return totalShoppingCart * (cupom.valueDiscount / 100) ?? 0;
      } else {
        return cupom.valueDiscount;
      }
    }
    return 0;
  }, [cupom, totalShoppingCart, dinamicDeliveryValue]);

  const generalTotal = useMemo(() => {
    return totalShoppingCart + dinamicDeliveryValue - dinamicCupomValue;
  }, [totalShoppingCart, dinamicDeliveryValue, dinamicCupomValue]);

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      observation: Yup.string(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      observation: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    const data = {
      clientId: userInfo.id ?? "",
      clientObject: userInfo,
      deliveryType: isDelivery,
      subtotal: totalShoppingCart,
      total: generalTotal,
      discount: dinamicCupomValue,
      cupomObject: cupom,
      deliveryValue: dinamicDeliveryValue,
      status: "Aberto",
      paymentMethod: selectedPaymentMethod,
      observation: formValues.observation,
      items: productsList,
      change: change,
      createdAt: new Date(Date.now()).getTime(),
      createdBy: "Site",
      updatedAt: new Date(Date.now()).getTime(),
      updatedBy: "Site",
    };

    const response = await createOrderFromSite(data);

    if (response.id) {
      addToast({
        severity: "success",
        message: "Pedido criado!",
      });

      localStorage.setItem("@currentOrder", response.id);

      navigate(`/acompanharPedido?pedido=${response.id}`);
    } else {
      addToast({
        severity: "error",
        message:
          "Tivemos um problema ao criar seu pedido, tente novamente mais tarde!",
      });
    }
  };

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
          <>
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary="Subtotal" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {formatCurrency(totalShoppingCart)}
              </Typography>
            </ListItem>
            {isDelivery === "Entrega" && (
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary={`Frete`} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {config.isFixedDeliveryTax
                    ? formatCurrency(config.deliveryTaxValue)
                    : formatCurrency(dinamicDeliveryValue)}
                </Typography>
              </ListItem>
            )}
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText
                primary={`Cupom de desconto: ${cupom ? cupom.description : ""}`}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                -{formatCurrency(dinamicCupomValue)}
              </Typography>
            </ListItem>
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary="Total" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {formatCurrency(generalTotal)}
              </Typography>
            </ListItem>
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText primary={`Estimativa de ${isDelivery}`} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {config.minimumDeliveryTime} min
              </Typography>
            </ListItem>
          </>
        )}
      </List>
      <Grid container spacing={2}>
        {isDelivery === "Entrega" ? (
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Entrega
            </Typography>
            <Typography gutterBottom>{userInfo.name}</Typography>
            <Typography gutterBottom>
              {`${userInfo.street}, ${userInfo.number}, ${userInfo.neigborhood}, ${userInfo.city}-${userInfo.state}, CEP: ${userInfo.zipcode}`}
            </Typography>
          </Grid>
        ) : (
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Retirada
            </Typography>
            <Typography gutterBottom>
              {`${config.street}, ${config.number}, ${config.neigborhood}, ${config.city}-${config.state}, CEP: ${config.zipcode}`}
            </Typography>
          </Grid>
        )}
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Metodo de pagamento
          </Typography>
          <Typography gutterBottom>
            {selectedPaymentMethod === "isCredit" && "Cartão de crédito"}
            {selectedPaymentMethod === "isDebit" && "Cartão de débito"}
            {selectedPaymentMethod === "isFoodCard" &&
              "Cartão Alimentação/Refeição"}
            {selectedPaymentMethod === "isMoney" && "Dinheiro"}
            {selectedPaymentMethod === "isPix" && "Pix"}
          </Typography>

          {
            selectedPaymentMethod === "isMoney" && (
              <Typography gutterBottom>
                Troco para R$ {change}
              </Typography>
            )
          }
        </Grid>
      </Grid>

      <TextField
        label="Observação"
        margin="normal"
        fullWidth
        multiline
        rows={4}
        id="observation"
        onChange={(event) =>
          formik.setFieldValue("observation", event.target.value)
        }
        value={formik.values.observation}
        helperText={formik.errors.observation}
        error={!!formik.errors.observation}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {activeStep !== 0 && (
          <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
            Voltar
          </Button>
        )}

        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          sx={{ mt: 3, ml: 1 }}
        >
          {activeStep === steps.length - 1 ? "Enviar pedido" : "Próximo"}
        </Button>
      </Box>
    </React.Fragment>
  );
}
