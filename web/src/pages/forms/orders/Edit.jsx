import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import DrawerComponent from "../../../componentes/DrawerComponent";
import { useAuth } from "../../../hooks/useAuth";
import { useClientes } from "../../../hooks/useClientes";
import { useLoader } from "../../../hooks/useLoader";
import { useProducts } from "../../../hooks/useProducts";
import { useToast } from "../../../hooks/useToast";
import { formatCurrency, maskCurrency } from "../../../utils/formatCurrency";
import { useState } from "react";
import NoData from "../../../componentes/NoData";
import { useOrders } from "../../../hooks/useOrders";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { useConfig } from "../../../hooks/useConfig";

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

export default function EditOrder() {
  const theme = useTheme();
  const { config } = useConfig();
  const { user, getUserByID } = useAuth();
  const { clientesList } = useClientes();
  const { productsList } = useProducts();
  const { orderStatus, updateOrder, selectedOrder, verifyCupom } = useOrders();

  const { addToast } = useToast();
  const { setIsLoading } = useLoader();

  const navigate = useNavigate();

  const [productsArray, setProductsArray] = useState(selectedOrder.items ?? []);
  const [cupom, setCupom] = useState(selectedOrder.cupomObject ?? null);

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      clientId: Yup.object().required("O campo Cliente é obrigatório"),
      deliveryType: Yup.string().required(
        "O campo Tipo de entrega é obrigatório"
      ),
      discount: Yup.string(),
      deliveryValue: Yup.string(),
      status: Yup.string().required("O campo Status é obrigatório"),
      paymentMethod: Yup.string().required("O campo Status é obrigatório"),
      observation: Yup.string(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      clientId: selectedOrder.clientObject ?? null,
      deliveryType: selectedOrder.deliveryType ?? "Entrega",
      discount: selectedOrder.discount ?? "0,00",
      deliveryValue: selectedOrder.deliveryValue ?? "0,00",
      status: selectedOrder.status ?? "Aberto",
      paymentMethod: selectedOrder.status ?? "isMoney",
      observation: selectedOrder.observation ?? "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    try {
      setIsLoading(true);

      if (productsArray.length === 0) {
        addToast({
          message: "Não é possível criar um pedido sem produtos",
          severity: "error",
        });
        return;
      }

      const data = {
        ...selectedOrder,
        clientId: formValues.clientId.id,
        clientObject: formValues.clientId,
        deliveryType: formValues.deliveryType,
        subtotal: subTotalCurrentOrder,
        total: totalCurrentOrder,
        discount: formValues.discount,
        cupomObject: cupom,
        deliveryValue: formValues.deliveryValue,
        status: formValues.status,
        paymentMethod: formValues.paymentMethod,
        observation: formValues.observation,
        items: productsArray,
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await updateOrder(data);

      addToast({
        message: "Pedido atualizado com sucesso!",
      });

      navigate("/pedidos");
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao atualizar Pedido!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formProductSchema = useMemo(() => {
    return Yup.object().shape({
      quantity: Yup.string().required("O campo Quantidade é obrigatório"),
      productId: Yup.object().required("O campo Produto é obrigatório"),
    });
  }, []);

  const formikProduct = useFormik({
    initialValues: {
      quantity: "",
      productId: null,
    },
    validationSchema: formProductSchema,
    onSubmit: (values) => {
      handleProductSubmitForm(values);
    },
  });

  const subTotalCurrentOrder = useMemo(() => {
    const soma = productsArray.reduce(
      (total, objeto) => total + objeto.totalAmount,
      0
    );

    return soma;
  }, [productsArray]);

  const totalCurrentOrder = useMemo(() => {
    const soma = productsArray.reduce(
      (total, objeto) => total + objeto.totalAmount,
      0
    );

    const desconto =
      formik.values.discount === ""
        ? 0
        : Number(formik.values.discount.replaceAll(".", "").replace(",", "."));

    const entrega =
      formik.values.deliveryValue === ""
        ? 0
        : Number(
            formik.values.deliveryValue.replaceAll(".", "").replace(",", ".")
          );

    return soma + entrega - desconto;
  }, [productsArray, formik.values.discount, formik.values.deliveryValue]);

  const handleProductSubmitForm = async (formValues) => {
    setProductsArray([
      ...productsArray,
      {
        quantity: formValues.quantity,
        productId: formValues.productId.id,
        unityAmount: formValues.productId.currentValue,
        totalAmount: formValues.productId.currentValue * formValues.quantity,
        productObject: formValues.productId,
      },
    ]);
  };

  const handleRemoveProductFromArray = (index) => {
    const itemsRestantes = productsArray.filter(
      (item, currentIndex) => currentIndex !== index
    );

    setProductsArray([...itemsRestantes]);
  };

  const handleUpdateIndexQuantity = (selectedIndex, updatedValue) => {
    const valueNumber = updatedValue === "" ? 0 : Number(updatedValue);

    productsArray[selectedIndex].quantity = valueNumber;
    productsArray[selectedIndex].totalAmount =
      valueNumber * productsArray[selectedIndex].unityAmount;

    setProductsArray([...productsArray]);
  };

  const [updatedDataInfo, setUpdatedDataInfo] = useState();

  const updateDiscountValues = useCallback(
    async (text) => {
      if (text === "") {
        setCupom(null);
        return;
      }

      const currentCupom = await verifyCupom(text);
      console.log("cupom", currentCupom);

      if (currentCupom) {
        setCupom(currentCupom);
        if (currentCupom.isPercentage) {
          formik.setFieldValue(
            "discount",
            maskCurrency(
              subTotalCurrentOrder * (currentCupom.valueDiscount / 100)
            )
          );
        }

        if (currentCupom.isFreeDelivery) {
          formik.setFieldValue(
            "discount",
            maskCurrency(formik.values.deliveryValue)
          );
        }

        if (currentCupom.isDelivery) {
          formik.setFieldValue(
            "discount",
            maskCurrency(currentCupom.valueDiscount)
          );
        }
      }
    },
    [formik, subTotalCurrentOrder, verifyCupom]
  );

  useEffect(() => {
    const executeAsync = async () => {
      const createdBy = await getUserByID(selectedOrder.createdBy);
      const updatedBy = await getUserByID(selectedOrder.updatedBy);

      document.getElementById("cupom").value =
        selectedOrder?.cupomObject?.description ?? "";

      setUpdatedDataInfo({
        createdBy,
        updatedBy,
      });
    };
    executeAsync();
  }, [selectedOrder, getUserByID]);

  return (
    <DrawerComponent
      title="Adicionar Pedido"
      header={
        <Grid container justifyContent="flex-end" sx={{ width: "100%" }}>
          <Button
            variant="contained"
            onClick={formik.handleSubmit}
            startIcon={<SaveIcon />}
            sx={{ mr: 2 }}
          >
            Salvar
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/pedidos")}
            startIcon={<CancelIcon />}
          >
            Cancelar
          </Button>
        </Grid>
      }
    >
      <Box
        sx={{
          width: "100%",
          mt: 1,
        }}
      >
        <Autocomplete
          id="clientId"
          value={formik.values.clientId}
          onChange={(event, newValue) => {
            formik.setFieldValue("clientId", newValue);
          }}
          options={clientesList}
          autoHighlight
          getOptionLabel={(option) =>
            `${option.name} - ${option.neigborhood}, ${option.city}-${option.state}`
          }
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > svg": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <PersonIcon />
              {option.name} - {option.neigborhood}, {option.city}-{option.state}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecione um cliente"
              inputProps={{
                ...params.inputProps,
              }}
            />
          )}
        />

        <Stack direction="column" spacing={1} my={2}>
          <Typography>Preferência</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              onClick={() => formik.setFieldValue("deliveryType", "Entrega")}
              variant={
                formik.values.deliveryType === "Entrega"
                  ? "contained"
                  : "outlined"
              }
            >
              Entrega
            </Button>
            <Button
              onClick={() => {
                formik.setFieldValue("discount", "0,00");
                formik.setFieldValue("deliveryType", "Retirada");
              }}
              variant={
                formik.values.deliveryType === "Retirada"
                  ? "contained"
                  : "outlined"
              }
            >
              Retirada
            </Button>
          </Stack>
        </Stack>

        <Stack direction="column" spacing={1} my={2}>
          <Typography>Produtos</Typography>
          <Stack direction="row" sx={{ width: "100%" }} spacing={1}>
            <FormControl fullWidth sx={{ my: 1, maxWidth: 100 }}>
              <InputLabel htmlFor="quantity">Quantidade</InputLabel>
              <OutlinedInput
                label="Quantidade"
                fullWidth
                id="quantity"
                onChange={(event) =>
                  formikProduct.setFieldValue("quantity", event.target.value)
                }
                value={formikProduct.values.quantity}
                error={!!formikProduct.errors.quantity}
              />
            </FormControl>

            <Autocomplete
              id="productId"
              value={formikProduct.values.productId}
              onChange={(event, newValue) => {
                formikProduct.setFieldValue("productId", newValue);
              }}
              options={productsList}
              sx={{ width: "100%" }}
              autoHighlight
              getOptionLabel={(option) =>
                `${option.name} - ${
                  option.currentValue && formatCurrency(option.currentValue)
                }`
              }
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > svg": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <PersonIcon />
                  {option.name} -{" "}
                  {option.currentValue && formatCurrency(option.currentValue)}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecione o produto"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />

            <Button
              onClick={(event) => {
                if (Object.keys(formikProduct.errors).length > 0) {
                  for (const chave in formikProduct.errors) {
                    addToast({
                      severity: "error",
                      message: formikProduct.errors[chave],
                    });
                  }
                  return;
                } else {
                  formikProduct.handleSubmit();
                }
              }}
              variant="contained"
            >
              <AddIcon />
            </Button>
          </Stack>
        </Stack>
        {productsArray.length > 0 ? (
          <Stack my={2} spacing={2}>
            <Divider />

            {productsArray.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                sx={{ width: "100%" }}
                spacing={1}
              >
                <FormControl fullWidth sx={{ my: 1, maxWidth: 100 }}>
                  <InputLabel htmlFor="quantity">Quantidade</InputLabel>
                  <OutlinedInput
                    label="Quantidade"
                    fullWidth
                    id={"quantity-" + index}
                    defaultValue={item.quantity}
                    onChange={(event) =>
                      handleUpdateIndexQuantity(index, event.target.value)
                    }
                  />
                </FormControl>

                <FormControl fullWidth sx={{ my: 1, width: "100%" }}>
                  <InputLabel htmlFor="product">Produto</InputLabel>
                  <OutlinedInput
                    disabled
                    label="Produto"
                    fullWidth
                    id="product"
                    value={item.productObject.name}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ my: 1, maxWidth: 130 }}>
                  <InputLabel htmlFor="value">Valor uni</InputLabel>
                  <OutlinedInput
                    disabled
                    label="Valor uni"
                    startAdornment={
                      <InputAdornment position="start">R$</InputAdornment>
                    }
                    fullWidth
                    id="unityAmount"
                    value={maskCurrency(item.unityAmount)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ my: 1, maxWidth: 130 }}>
                  <InputLabel htmlFor="value">Valor</InputLabel>
                  <OutlinedInput
                    disabled
                    label="Valor"
                    startAdornment={
                      <InputAdornment position="start">R$</InputAdornment>
                    }
                    fullWidth
                    id="totalAmount"
                    value={maskCurrency(item.totalAmount)}
                  />
                </FormControl>

                <Button
                  onClick={() => handleRemoveProductFromArray(index)}
                  variant="contained"
                >
                  <DeleteIcon />
                </Button>
              </Stack>
            ))}

            <Divider />
            <Stack direction="column" justifyContent="flex-end" spacing={1}>
              <Stack direction="row" justifyContent="flex-end">
                <FormControl fullWidth sx={{ my: 1, maxWidth: 150 }}>
                  <InputLabel htmlFor="subtotal">Subtotal</InputLabel>
                  <OutlinedInput
                    label="Subtotal"
                    fullWidth
                    disabled
                    startAdornment={
                      <InputAdornment position="start">R$</InputAdornment>
                    }
                    id="subtotal"
                    value={maskCurrency(subTotalCurrentOrder)}
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" justifyContent="flex-end">
                <FormControl fullWidth sx={{ my: 1, maxWidth: 150 }}>
                  <InputLabel htmlFor="valueDiscount">
                    Valor da entrega
                  </InputLabel>
                  <OutlinedInput
                    label="Valor da entrega"
                    fullWidth
                    startAdornment={
                      <InputAdornment position="start">R$</InputAdornment>
                    }
                    id="deliveryValue"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "deliveryValue",
                        maskCurrency(event.target.value)
                      )
                    }
                    value={formik.values.deliveryValue}
                    error={!!formik.errors.deliveryValue}
                  />

                  {!!formik.errors.deliveryValue && (
                    <FormHelperText
                      error={!!formik.errors.deliveryValue}
                      id="deliveryValue-helper-text"
                    >
                      {formik.errors.deliveryValue}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <FormControl fullWidth sx={{ my: 1, maxWidth: 150 }}>
                  <InputLabel shrink={true} htmlFor="cupom">
                    Cupom
                  </InputLabel>
                  <OutlinedInput
                    label="Cupom"
                    fullWidth
                    id="cupom"
                    defaultValue={cupom?.description ?? ""}
                    onChange={(event) => {
                      updateDiscountValues(event.target.value);
                    }}
                    InputLabelProps={{
                      shrink: true, // Reduz o rótulo para cima mesmo com um valor definido
                    }}
                    error={cupom && Object.keys(cupom).length === 0}
                  />
                  {cupom && Object.keys(cupom).length === 0 && (
                    <FormHelperText
                      error={cupom && Object.keys(cupom).length === 0}
                      id="cupom-helper-text"
                    >
                      Cupom inválido
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth sx={{ my: 1, maxWidth: 150 }}>
                  <InputLabel htmlFor="valueDiscount">Desconto</InputLabel>
                  <OutlinedInput
                    label="Desconto"
                    fullWidth
                    startAdornment={
                      <InputAdornment position="start">R$</InputAdornment>
                    }
                    id="discount"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "discount",
                        maskCurrency(event.target.value)
                      )
                    }
                    value={formik.values.discount}
                    error={!!formik.errors.discount}
                  />

                  {!!formik.errors.discount && (
                    <FormHelperText
                      error={!!formik.errors.discount}
                      id="discount-helper-text"
                    >
                      {formik.errors.discount}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              <Stack direction="row" justifyContent="flex-end">
                <FormControl fullWidth sx={{ my: 1, maxWidth: 150 }}>
                  <InputLabel htmlFor="Total">Total</InputLabel>
                  <OutlinedInput
                    label="Total"
                    fullWidth
                    disabled
                    startAdornment={
                      <InputAdornment position="start">R$</InputAdornment>
                    }
                    id="Total"
                    value={maskCurrency(totalCurrentOrder)}
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row" sx={{ width: "100%" }} marginY={4}>
            <NoData
              primaryColor={theme.palette.primary.main}
              description={
                <Stack direction="column" spacing={4} maxWidth={300}>
                  <Typography variant="body2" textAlign="center">
                    Sem produtos no pedido
                  </Typography>
                </Stack>
              }
              style={{
                width: 250,
                height: 250,
              }}
            />
          </Stack>
        )}

        <FormControl fullWidth>
          <InputLabel id="status-label">Status do pedido</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={formik.values.status}
            label="Status do pedido"
            onChange={(event) =>
              formik.setFieldValue("status", event.target.value)
            }
          >
            {orderStatus
              .filter((item) => item.flow.includes(formik.values.deliveryType))
              .map((item, index) => (
                <MenuItem
                  key={index}
                  display="block"
                  variant="body1"
                  value={item.name}
                >
                  {item.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="paymentMethod-label">Método de pagamento</InputLabel>
          <Select
            labelId="paymentMethod-label"
            id="paymentMethod-select"
            value={formik.values.paymentMethod}
            label="Método de pagamento"
            onChange={(event) =>
              formik.setFieldValue("paymentMethod", event.target.value)
            }
          >
            {config.paymentMethodsAccepted.isCredit && (
              <MenuItem display="block" variant="body1" value={"isCredit"}>
                Cartão de crédito
              </MenuItem>
            )}
            {config.paymentMethodsAccepted.isDebit && (
              <MenuItem display="block" variant="body1" value={"isDebit"}>
                Cartão de débito
              </MenuItem>
            )}
            {config.paymentMethodsAccepted.isFoodCard && (
              <MenuItem display="block" variant="body1" value={"isFoodCard"}>
                Cartão Alimentação/Refeição
              </MenuItem>
            )}
            {config.paymentMethodsAccepted.isMoney && (
              <MenuItem display="block" variant="body1" value={"isMoney"}>
                Dinheiro
              </MenuItem>
            )}
            {config.paymentMethodsAccepted.isPix && (
              <MenuItem display="block" variant="body1" value={"isPix"}>
                Pix
              </MenuItem>
            )}
          </Select>
        </FormControl>
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

        <Stack>
          <Typography>
            <b>Criado por:</b> {updatedDataInfo?.createdBy?.name ?? ""} em{" "}
            {dayjs().from(dayjs(new Date(selectedOrder?.createdAt)), true)}
          </Typography>
          <Typography>
            <b>Atualizado por:</b> {updatedDataInfo?.updatedBy?.name ?? ""} em{" "}
            {dayjs().from(dayjs(new Date(selectedOrder?.updatedAt)), true)}
          </Typography>
        </Stack>
      </Box>
    </DrawerComponent>
  );
}
