import { Button, Stack } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React, { useMemo } from "react";
import * as Yup from "yup";
import { useLoader } from "../hooks/useLoader";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { useToast } from "../hooks/useToast";
import { getCepInformation } from "../utils/getCepInformation";
import { celular, cep, cpf, isStringEmpty } from "../utils/string";

export default function AddressForm({
  handleBack,
  handleNext,
  activeStep,
  steps,
}) {
  const {
    userInfo,
    setUserInfo,
    isDelivery,
    setIsDelivery,
    getClientByPhoneNumber,
  } = useShoppingCart();

  const { setIsLoading } = useLoader();
  const { addToast } = useToast();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("O campo Nome é obrigatório"),
      phoneNumber: Yup.string().required("O campo Telefone é obrigatório"),
      cpf: Yup.string(),
      zipcode: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      neigborhood: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      isDelivery: Yup.string(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: userInfo?.name ?? "",
      phoneNumber: userInfo?.phoneNumber ?? "",
      cpf: userInfo?.cpf ?? "",
      zipcode: userInfo?.zipcode ?? "",
      street: userInfo?.street ?? "",
      number: userInfo?.number ?? "",
      neigborhood: userInfo?.neigborhood ?? "",
      city: userInfo?.city ?? "",
      state: userInfo?.state ?? "",
      isDelivery: isDelivery ?? "Entrega",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    if (
      formValues.isDelivery === "Entrega" &&
      (isStringEmpty(formValues.zipcode) ||
        isStringEmpty(formValues.street) ||
        isStringEmpty(formValues.number) ||
        isStringEmpty(formValues.neigborhood) ||
        isStringEmpty(formValues.city) ||
        isStringEmpty(formValues.state))
    ) {
      addToast({
        severity: "error",
        message:
          "Opção entrega selecionada, precisa preencher com o endereço completo",
      });
      return;
    }

    try {
      const data = {
        ...userInfo,
        name: formValues.name,
        phoneNumber: formValues.phoneNumber,
        zipcode: formValues.zipcode,
        cpf: formValues.cpf,
        street: formValues.street,
        number: formValues.number,
        neigborhood: formValues.neigborhood,
        city: formValues.city,
        state: formValues.state,
        createdAt: new Date(Date.now()).getTime(),
        createdBy: "site",
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: "site",
      };

      setIsDelivery(formValues.isDelivery);

      setUserInfo(data);
      handleNext();
    } catch (error) {
      console.log("handleSubmit error", error);
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Endereço para entrega
      </Typography>
      <Box
        sx={{
          width: "100%",
          mt: 1,
        }}
      >
        <Stack direction="column" spacing={1} my={2}>
          <Typography>Preferência</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              type="button"
              onClick={() => formik.setFieldValue("isDelivery", "Entrega")}
              variant={
                formik.values.isDelivery === "Entrega"
                  ? "contained"
                  : "outlined"
              }
            >
              Entrega
            </Button>
            <Button
              type="button"
              onClick={() => {
                formik.setFieldValue("discount", "0,00");
                formik.setFieldValue("isDelivery", "Retirada");
              }}
              variant={
                formik.values.isDelivery === "Retirada"
                  ? "contained"
                  : "outlined"
              }
            >
              Retirada
            </Button>
          </Stack>
        </Stack>

        <TextField
          label="Nome"
          margin="normal"
          fullWidth
          id="name"
          onChange={(event) => formik.setFieldValue("name", event.target.value)}
          value={formik.values.name}
          helperText={formik.errors.name}
          error={!!formik.errors.name}
        />
        <TextField
          label="Telefone"
          margin="normal"
          fullWidth
          id="phoneNumber"
          inputProps={{
            maxLength: 15,
          }}
          onChange={(event) =>
            formik.setFieldValue("phoneNumber", celular(event.target.value))
          }
          onBlur={async (event) => {
            setIsLoading(true);
            const response = await getClientByPhoneNumber(event.target.value);

            if (response.length > 0) {
              addToast({
                severity: "success",
                message: "Cliente encontrado",
              });
              setUserInfo(response[0]);
              formik.setFieldValue("name", response[0].name ?? "");
              formik.setFieldValue("cpf", response[0].cpf ?? "");

              formik.setFieldValue("street", response[0].street ?? "");
              formik.setFieldValue("zipcode", response[0].zipcode ?? "");
              formik.setFieldValue("number", response[0].number ?? "");
              formik.setFieldValue(
                "neigborhood",
                response[0].neigborhood ?? ""
              );
              formik.setFieldValue("city", response[0].city ?? "");
              formik.setFieldValue("state", response[0].state ?? "");
              formik.setFieldValue("number", response[0].number ?? "");
            }
            setIsLoading(false);
          }}
          value={formik.values.phoneNumber}
          helperText={formik.errors.phoneNumber}
          error={!!formik.errors.phoneNumber}
        />
        <TextField
          label="CPF"
          margin="normal"
          fullWidth
          id="cpf"
          inputProps={{
            maxLength: 14,
          }}
          onChange={(event) =>
            formik.setFieldValue("cpf", cpf(event.target.value))
          }
          value={formik.values.cpf}
          helperText={formik.errors.cpf}
          error={!!formik.errors.cpf}
        />
        {
          formik.values.isDelivery === "Entrega" && (
            <>
              <Typography variant="body2" my={2}>
                Endereço pra entrega
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CEP"
                    inputProps={{
                      maxLength: 9,
                    }}
                    fullWidth
                    id="zipcode"
                    onChange={(event) => {
                      formik.setFieldValue("zipcode", cep(event.target.value));
                    }}
                    onBlur={async (event) => {
                      if (event.target.value.length === 9) {
                        try {
                          setIsLoading(true);
                          const resultCep = await getCepInformation(
                            event.target.value
                          );
                          if (resultCep.data.erro) {
                            addToast({
                              message: "CEP Não encontrado!",
                              severity: "warning",
                            });
                          } else {
                            if (resultCep.status === 200) {
                              formik.setFieldValue(
                                "neigborhood",
                                resultCep.data.bairro
                              );
                              formik.setFieldValue(
                                "street",
                                resultCep.data.logradouro
                              );
                              formik.setFieldValue("city", resultCep.data.localidade);
                              formik.setFieldValue("state", resultCep.data.uf);

                              addToast({
                                message: "CEP Encontrado!",
                                severity: "success",
                              });
                            } else {
                              addToast({
                                message: "Não foi possivel pesquisar o CEP!",
                                severity: "error",
                              });
                            }
                          }
                        } catch (error) {
                          console.log("locateCep error", error);
                        } finally {
                          setIsLoading(false);
                        }
                      }
                    }}
                    value={formik.values.zipcode}
                    helperText={formik.errors.zipcode}
                    error={!!formik.errors.zipcode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Rua"
                    fullWidth
                    id="street"
                    onChange={(event) =>
                      formik.setFieldValue("street", event.target.value)
                    }
                    value={formik.values.street}
                    helperText={formik.errors.street}
                    error={!!formik.errors.street}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Numero"
                    fullWidth
                    id="number"
                    onChange={(event) =>
                      formik.setFieldValue("number", event.target.value)
                    }
                    value={formik.values.number}
                    helperText={formik.errors.number}
                    error={!!formik.errors.number}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Bairro"
                    fullWidth
                    id="neigborhood"
                    onChange={(event) =>
                      formik.setFieldValue("neigborhood", event.target.value)
                    }
                    value={formik.values.neigborhood}
                    helperText={formik.errors.neigborhood}
                    error={!!formik.errors.neigborhood}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cidade"
                    fullWidth
                    id="city"
                    onChange={(event) =>
                      formik.setFieldValue("city", event.target.value)
                    }
                    value={formik.values.city}
                    helperText={formik.errors.city}
                    error={!!formik.errors.city}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Estado"
                    fullWidth
                    id="state"
                    onChange={(event) =>
                      formik.setFieldValue("state", event.target.value)
                    }
                    value={formik.values.state}
                    helperText={formik.errors.state}
                    error={!!formik.errors.state}
                  />
                </Grid>
              </Grid>
            </>
          )
        }
      </Box>
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
