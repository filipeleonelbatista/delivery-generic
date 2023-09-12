import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MapIcon from "@mui/icons-material/Map";
import PhoneIcon from "@mui/icons-material/Phone";
import SaveIcon from "@mui/icons-material/Save";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { celular, cnpj } from "../../../utils/string";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as Yup from "yup";
import { useConfig } from "../../../hooks/useConfig";
import { useLoader } from "../../../hooks/useLoader";
import { useToast } from "../../../hooks/useToast";
import { useAuth } from "../../../hooks/useAuth";

export default function GeneralConfig() {
  const { config, updateConfig } = useConfig();
  const { setIsLoading } = useLoader();
  const { addToast } = useToast();
  const { user } = useAuth();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("O campo Nome é obrigatório"),
      cnpj: Yup.string().required("O campo CNPJ é obrigatório"),
      telefone: Yup.string(),
      whatsapp: Yup.string().required("O campo WhatsApp é obrigatório"),
      about: Yup.string(),
      subtitle: Yup.string(),
      instagram: Yup.string(),
      facebook: Yup.string(),
      mapLink: Yup.string(),
      itemsPerPage: Yup.number(),
      isMaintence: Yup.boolean(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: config.name ?? "",
      cnpj: config.cnpj ?? "",
      telefone: config.telefone ?? "",
      whatsapp: config.whatsapp ?? "",
      about: config.about ?? "",
      subtitle: config.subtitle ?? "",
      instagram: config.instagram ?? "",
      facebook: config.facebook ?? "",
      mapLink: config.mapLink ?? "",
      isMaintence: config.isMaintence ?? false,
      itemsPerPage: config.itemsPerPage ?? 10,
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
        ...config,
        name: formValues.name,
        cnpj: formValues.cnpj,
        telefone: formValues.telefone,
        whatsapp: formValues.whatsapp,
        about: formValues.about,
        subtitle: formValues.subtitle,
        instagram: formValues.instagram,
        facebook: formValues.facebook,
        mapLink: formValues.mapLink,
        isMaintence: formValues.isMaintence,
        itemsPerPage: Number(formValues.itemsPerPage),
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await updateConfig(data);

      addToast({
        message: "Configurações Gerais atualizadas!",
      });
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao atualizar Configurações Gerais!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack>
      <Grid container justifyContent="flex-end" sx={{ width: "100%" }}>
        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          startIcon={<SaveIcon />}
          sx={{ mr: 2 }}
        >
          Salvar
        </Button>
      </Grid>
      <Box
        sx={{
          width: "100%",
          mt: 1,
        }}
      >
        <Stack spacing={2} direction="row" alignItems="center">
          <TextField
            label="Items por página"
            margin="normal"
            sx={{ width: 250 }}
            id="itemsPerPage"
            onChange={(event) =>
              formik.setFieldValue("itemsPerPage", event.target.value)
            }
            value={formik.values.itemsPerPage}
            helperText={
              formik.errors.itemsPerPage
                ? formik.errors.itemsPerPage
                : "Quantidade de itens nas listas de produtos"
            }
            error={!!formik.errors.itemsPerPage}
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) =>
                  formik.setFieldValue("isMaintence", event.target.checked)
                }
                checked={formik.values.isMaintence}
                color="primary"
              />
            }
            label="Colocar o site em manutenção"
          />
        </Stack>
        <Divider sx={{ my: 4 }} />

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
          label="CNPJ"
          margin="normal"
          fullWidth
          id="cnpj"
          inputProps={{
            maxLength: 18,
          }}
          onChange={(event) =>
            formik.setFieldValue("cnpj", cnpj(event.target.value))
          }
          value={formik.values.cnpj}
          helperText={formik.errors.cnpj}
          error={!!formik.errors.cnpj}
        />
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel htmlFor="telefone">Telefone</InputLabel>
          <OutlinedInput
            label="Telefone"
            margin="normal"
            fullWidth
            inputProps={{
              maxLength: 14,
            }}
            startAdornment={
              <InputAdornment position="start">
                <PhoneIcon />
              </InputAdornment>
            }
            id="telefone"
            onChange={(event) =>
              formik.setFieldValue("telefone", celular(event.target.value))
            }
            value={formik.values.telefone}
            error={!!formik.errors.telefone}
          />

          {!!formik.errors.telefone && (
            <FormHelperText
              error={!!formik.errors.telefone}
              id="telefone-helper-text"
            >
              {formik.errors.telefone}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel htmlFor="whatsapp">WhatsApp</InputLabel>
          <OutlinedInput
            label="WhatsApp"
            margin="normal"
            fullWidth
            inputProps={{
              maxLength: 15,
            }}
            startAdornment={
              <InputAdornment position="start">
                <WhatsAppIcon />
              </InputAdornment>
            }
            id="whatsapp"
            onChange={(event) =>
              formik.setFieldValue("whatsapp", celular(event.target.value))
            }
            value={formik.values.whatsapp}
            error={!!formik.errors.whatsapp}
          />

          {!!formik.errors.whatsapp && (
            <FormHelperText
              error={!!formik.errors.whatsapp}
              id="whatsapp-helper-text"
            >
              {formik.errors.whatsapp}
            </FormHelperText>
          )}
        </FormControl>

        <TextField
          label="Subtitulo da empresa"
          margin="normal"
          fullWidth
          id="subtitle"
          onChange={(event) => {
            formik.setFieldValue("subtitle", event.target.value);
          }}
          value={formik.values.subtitle}
          helperText={
            !!formik.errors.subtitle
              ? formik.errors.subtitle
              : "Subtitulo do site"
          }
          error={!!formik.errors.subtitle}
        />

        <TextField
          label="Sobre a empresa"
          margin="normal"
          fullWidth
          id="about"
          multiline
          rows={4}
          onChange={(event) => {
            formik.setFieldValue("about", event.target.value);
          }}
          value={formik.values.about}
          helperText={formik.errors.about}
          error={!!formik.errors.about}
        />

        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel htmlFor="instagram">Instagram</InputLabel>
          <OutlinedInput
            label="Instagram"
            margin="normal"
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <InstagramIcon />
              </InputAdornment>
            }
            id="instagram"
            onChange={(event) =>
              formik.setFieldValue("instagram", event.target.value)
            }
            value={formik.values.instagram}
            error={!!formik.errors.instagram}
          />

          {!!formik.errors.instagram && (
            <FormHelperText
              error={!!formik.errors.instagram}
              id="instagram-helper-text"
            >
              {formik.errors.instagram}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel htmlFor="facebook">Facebook</InputLabel>
          <OutlinedInput
            label="Facebook"
            margin="normal"
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <FacebookIcon />
              </InputAdornment>
            }
            id="facebook"
            onChange={(event) =>
              formik.setFieldValue("facebook", event.target.value)
            }
            value={formik.values.facebook}
            error={!!formik.errors.facebook}
          />

          {!!formik.errors.facebook && (
            <FormHelperText
              error={!!formik.errors.facebook}
              id="facebook-helper-text"
            >
              {formik.errors.facebook}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel htmlFor="mapLink">Link do mapa</InputLabel>
          <OutlinedInput
            label="Link do mapa"
            margin="normal"
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <MapIcon />
              </InputAdornment>
            }
            id="mapLink"
            onChange={(event) =>
              formik.setFieldValue("mapLink", event.target.value)
            }
            value={formik.values.mapLink}
            error={!!formik.errors.mapLink}
          />

          {!!formik.errors.mapLink && (
            <FormHelperText
              error={!!formik.errors.mapLink}
              id="mapLink-helper-text"
            >
              {formik.errors.mapLink}
            </FormHelperText>
          )}
        </FormControl>
      </Box>
    </Stack>
  );
}
