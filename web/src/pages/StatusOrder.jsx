import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import * as React from "react";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";

import { Button, CardMedia, Stack, TextField } from "@mui/material";
import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

import { useEffect, useState, useMemo } from "react";
import { useConfig } from "../hooks/useConfig?";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import queryString from "query-string";
import Footer from "../componentes/Footer";
import Header from "../componentes/Header";
import NoData from "../componentes/NoData";
import SEO from "../componentes/SEO";
import { useOrders } from "../hooks/useOrders";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { useCallback } from "react";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "em %s",
    past: "%s atrás",
    s: "alguns segundos",
    m: "um minuto",
    mm: "%d minutos",
    h: "uma hora",
    hh: "%d horas",
    d: "um dia",
    dd: "%d dias",
    M: "um mês",
    MM: "%d meses",
    y: "um ano",
    yy: "%d anos",
  },
});

export default function StatusOrder() {
  const { getOrdersByID, orderStatus } = useOrders();
  const { config } = useConfig();
  const navigate = useNavigate();
  const theme = useTheme();

  const [order, setOrder] = useState();

  const loadData = useCallback(async () => {
    const queryParams = queryString.parse(location.search);
    if (queryParams.pedido) {
      const response = await getOrdersByID(queryParams.pedido);

      if (!response) {
        navigate("/404-pedido-nao-encontrado");
      } else {
        setOrder(response);
      }
    } else {
      navigate.push("/404-pedido-nao-encontrado");
    }
  }, [getOrdersByID, navigate]);

  const activeStep = useMemo(() => {
    const response = orderStatus.findIndex(
      (item) => item.name === order?.status
    );
    console.log("response", response);
    return response;
  }, [orderStatus, order]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     loadData();
  //   }, 5000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [loadData]);

  return (
    <>
      <SEO title="Acompanhar o pedido" />
      <Container maxWidth="lg">
        <Header />
        <main>
          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Paper
              variant="outlined"
              sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
            >
              <Typography component="h1" variant="h4" align="center">
                Seu pedido
              </Typography>

              <Stepper
                activeStep={activeStep}
                sx={{ pt: 3, pb: 5 }}
                alternativeLabel
              >
                {orderStatus
                  .filter((item) => item.flow.includes(order?.deliveryType))
                  .slice(
                    0,
                    order?.status === "Cancelado"
                      ? orderStatus.length
                      : orderStatus.length - 2
                  )
                  .map((item, index) => (
                    <Step key={index}>
                      <StepLabel>{item.name}</StepLabel>
                    </Step>
                  ))}
              </Stepper>

              <React.Fragment>
                <Typography variant="h6" gutterBottom>
                  Produtos
                </Typography>
                <List disablePadding>
                  {order?.items?.length > 0 ? (
                    order?.items.map((product, index) => (
                      <ListItem
                        key={index ?? product.name}
                        sx={{ py: 1, px: 0 }}
                      >
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
                            Sem produtos cadastrados no momento. Adicione
                            produtos ao carrinho de compras e eles aparecerão
                            aqui
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
                  {order?.items?.length > 0 && (
                    <>
                      <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemText primary="Subtotal" />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700 }}
                        >
                          {formatCurrency(order.subtotal)}
                        </Typography>
                      </ListItem>
                      {order?.deliveryType === "Entrega" && (
                        <ListItem sx={{ py: 1, px: 0 }}>
                          <ListItemText primary="Frete" />
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700 }}
                          >
                            {formatCurrency(order.deliveryValue)}
                          </Typography>
                        </ListItem>
                      )}
                      <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemText
                          primary={`Cupom de desconto: ${order.cupomObject
                            ? order.cupomObject.description
                            : ""
                            }`}
                        />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700 }}
                        >
                          -{formatCurrency(order.discount)}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemText primary="Total" />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700 }}
                        >
                          {formatCurrency(order.total)}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemText
                          primary={`Estimativa de ${order?.deliveryType}`}
                        />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700 }}
                        >
                          {config.minimumDeliveryTime} minutos
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ py: 1, px: 0 }}>
                        <ListItemText primary="Pedido criado em" />
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700 }}
                        >
                          {dayjs().from(
                            dayjs(new Date(order?.createdAt)),
                            true
                          )}
                        </Typography>
                      </ListItem>
                    </>
                  )}
                </List>
                <Grid container spacing={2}>
                  {order?.deliveryType === "Entrega" ? (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Entrega
                      </Typography>
                      <Typography gutterBottom>
                        {order.clientObject.name}
                      </Typography>
                      <Typography gutterBottom>
                        {`${order.clientObject.street}, ${order.clientObject.number}, ${order.clientObject.neigborhood}, ${order.clientObject.city}-${order.clientObject.state}, CEP: ${order.clientObject.zipcode}`}
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Retirada
                      </Typography>
                      <Typography gutterBottom>
                        {`${config?.street}, ${config?.number}, ${config?.neigborhood}, ${config?.city}-${config?.state}, CEP: ${config?.zipcode}`}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item container direction="column" xs={12} sm={6}>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Metodo de pagamento
                    </Typography>
                    <Typography gutterBottom>
                      {order?.paymentMethod === "isCredit" &&
                        "Cartão de crédito"}
                      {order?.paymentMethod === "isDebit" && "Cartão de débito"}
                      {order?.paymentMethod === "isFoodCard" &&
                        "Cartão Alimentação/Refeição"}
                      {order?.paymentMethod === "isMoney" && "Dinheiro"}
                      {order?.paymentMethod === "isPix" && "Pix"}
                    </Typography>
                    {
                      order?.paymentMethod === "isMoney" && order.change && (
                        <Typography gutterBottom>
                          Troco para R$ {order.change}
                        </Typography>
                      )
                    }
                  </Grid>
                </Grid>

                <TextField
                  label="Observação"
                  margin="normal"
                  fullWidth
                  disabled={true}
                  multiline
                  rows={4}
                  id="observation"
                  defaultValue={order?.observation}
                  value={order?.observation}
                  InputProps={{
                    readOnly: true, // Define o campo como somente leitura
                  }}
                  InputLabelProps={{
                    shrink: true, // Reduz o rótulo para cima mesmo com um valor definido
                  }}
                />

                <Typography sx={{ width: "100%", textAlign: "center", my: 4 }}>
                  Houve algum problema? Entre em contato!
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                  {config?.whatsapp && (
                    <Button
                      fullWidth
                      startIcon={<WhatsAppIcon />}
                      component="a"
                      variant="contained"
                      target="_blank"
                      sx={{ textDecoration: "none", color: "white" }}
                      href={`https://wa.me/+55${config.whatsapp.replace(
                        /\D/g,
                        ""
                      )}?text=Preciso+de+ajuda+com+o+pedido+${queryString.parse(location.search).pedido
                        }`}
                    >
                      WhatsApp
                    </Button>
                  )}
                  {config?.telefone && (
                    <Button
                      fullWidth
                      startIcon={<PhoneIcon />}
                      component="a"
                      variant="contained"
                      target="_blank"
                      sx={{ textDecoration: "none", color: "white" }}
                      href={`tel:${config.telefone.replace(/\D/g, "")}`}
                    >
                      Telefone
                    </Button>
                  )}
                </Stack>
              </React.Fragment>
            </Paper>
          </Container>
        </main>
      </Container>
      <Footer title="My Delivery App" />
    </>
  );
}
