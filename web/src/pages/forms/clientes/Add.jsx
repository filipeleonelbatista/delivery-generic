import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import DrawerComponent from "../../../componentes/DrawerComponent";
import { useAuth } from "../../../hooks/useAuth";
import { useClientes } from "../../../hooks/useClientes";
import { useLoader } from "../../../hooks/useLoader";
import { useToast } from "../../../hooks/useToast";
import { getCepInformation } from "../../../utils/getCepInformation";
import { celular, cep, cpf } from "../../../utils/string";

export default function AddCliente() {
  const { user } = useAuth();
  const { addCliente: adicionarCliente } = useClientes();

  const { addToast } = useToast();
  const { setIsLoading } = useLoader();

  const navigate = useNavigate();

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
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNumber: "",
      cpf: "",
      zipcode: "",
      street: "",
      number: "",
      neigborhood: "",
      city: "",
      state: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    try {
      setIsLoading(true);

      const data = {
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
        createdBy: user.uid,
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await adicionarCliente(data);

      addToast({
        message: "Cliente adicionado com sucesso!",
      });

      navigate("/clientes");
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao adicionar Cliente!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DrawerComponent
      title="Adicionar cliente"
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
            onClick={() => navigate("/clientes")}
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
      </Box>
    </DrawerComponent>
  );
}
