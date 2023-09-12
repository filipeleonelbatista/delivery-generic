import SaveIcon from "@mui/icons-material/Save";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import * as Yup from "yup";
import { useConfig } from "../../../hooks/useConfig";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";
import { useLoader } from "../../../hooks/useLoader";
import deleteImageFromStorage from "../../../utils/deleteImageFromStorage";
import { uploadImageAsync } from "../../../utils/uploadImageAsync";

export default function ApparenceConfig() {
  const { config, updateConfig } = useConfig();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { setIsLoading } = useLoader();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      favicon: Yup.mixed()
        .test("fileFormat", "A imagem deve ser um arquivo PNG", (value) => {
          if (!value) return true;
          return value && value.type === "image/png";
        })
        .test(
          "fileSize",
          "A imagem deve ter no máximo 64x64 pixels",
          async (value) => {
            if (!value) return true;
            const image = new Image();
            const fileUrl = URL.createObjectURL(value);

            return new Promise((resolve) => {
              image.onload = () => {
                URL.revokeObjectURL(fileUrl);
                const { width, height } = image;
                resolve(width <= 64 && height <= 64);
              };
              image.src = fileUrl;
            });
          }
        ),
      logo: Yup.mixed()
        .test("fileFormat", "A imagem deve ser um arquivo PNG", (value) => {
          if (!value) return true;
          return value && value.type === "image/png";
        })
        .test(
          "fileSize",
          "A imagem deve ter no máximo 400x200 pixels",
          async (value) => {
            if (!value) return true;
            const image = new Image();
            const fileUrl = URL.createObjectURL(value);

            return new Promise((resolve) => {
              image.onload = () => {
                URL.revokeObjectURL(fileUrl);
                const { width, height } = image;
                resolve(width <= 400 && height <= 200);
              };
              image.src = fileUrl;
            });
          }
        ),
      useLogoInHeader: Yup.boolean(),
      listOptionMenuName: Yup.string(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      favicon: "",
      logo: "",
      listOptionMenuName: config.listOptionMenuName ?? "",
      useLogoInHeader: config.useLogoInHeader ?? false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const [selectedImageFavicon, setSelectedImageFavicon] = useState(
    config.favicon ?? ""
  );
  const [selectedImageLogo, setSelectedImageLogo] = useState(config.logo ?? "");

  const handleFilePreview = (e, field) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    formik.setFieldValue(field, file);

    reader.onloadend = () => {
      if (field === "favicon") {
        setSelectedImageFavicon(reader.result);
      } else {
        setSelectedImageLogo(reader.result);
      }
    };
  };

  const handleSubmitForm = async (formValues) => {
    try {
      setIsLoading(true);

      let faviconUploaded = "";

      if (formValues.favicon !== "") {
        deleteImageFromStorage(config.favicon);
        faviconUploaded = await uploadImageAsync(
          formValues.favicon,
          "configuracoes"
        );
      } else {
        faviconUploaded = selectedImageFavicon;
      }

      let logoUploaded = "";

      if (formValues.logo !== "") {
        deleteImageFromStorage(config.logo);
        logoUploaded = await uploadImageAsync(formValues.logo, "configuracoes");
      } else {
        logoUploaded = selectedImageLogo;
      }

      const data = {
        ...config,
        favicon: faviconUploaded,
        logo: logoUploaded,
        listOptionMenuName: formValues.listOptionMenuName,
        useLogoInHeader: formValues.useLogoInHeader,
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await updateConfig(data);

      addToast({
        message: "Aparência atualizada!",
      });
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao atualizar Aparência!",
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
        <TextField
          id="listOptionMenuName"
          label="Nome da area de produtos do site"
          helperText={
            formik.errors.listOptionMenuName
              ? formik.errors.listOptionMenuName
              : "Use Cardápio ou Menu ou digite o que preferir."
          }
          error={!!formik.errors.listOptionMenuName}
          value={formik.values.listOptionMenuName}
          onChange={(event) =>
            formik.setFieldValue("listOptionMenuName", event.target.value)
          }
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h6">Icone do site</Typography>
          <Typography variant="caption">
            Logotipo do site precisa ser um arquivo .png de 32x32 ou 64x64
            pixels
          </Typography>
          <IconButton aria-label="Enviar foto" component="label">
            <input
              hidden
              id="favicon"
              name="favicon"
              accept="image/*"
              type="file"
              onChange={(event) => handleFilePreview(event, "favicon")}
            />
            <Avatar
              sx={{ bgcolor: "primary.light", width: 80, height: 80 }}
              src={selectedImageFavicon}
              alt="Foto icone"
            >
              <PhotoCameraIcon sx={{ width: 30, height: 30 }} />
            </Avatar>
          </IconButton>
          {!!formik.errors.favicon && (
            <Typography color={"error"}>{formik.errors.favicon}</Typography>
          )}
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            my: 2,
          }}
        >
          <Typography variant="h6">Logo do site</Typography>
          <IconButton aria-label="Enviar foto" component="label">
            <input
              hidden
              id="logo"
              name="logo"
              accept="image/*"
              type="file"
              onChange={(event) => handleFilePreview(event, "logo")}
            />
            <Avatar
              sx={{ bgcolor: "primary.light", width: 120, height: 120 }}
              src={selectedImageLogo}
              alt="Foto logo"
            >
              <PhotoCameraIcon sx={{ width: 50, height: 50 }} />
            </Avatar>
          </IconButton>

          {!!formik.errors.logo && (
            <Typography color={"error"}>{formik.errors.logo}</Typography>
          )}
        </Box>

        <Stack direction="column" sx={{ mb: 4 }} spacing={1}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) =>
                  formik.setFieldValue("useLogoInHeader", event.target.checked)
                }
                checked={formik.values.useLogoInHeader}
                color="primary"
              />
            }
            label="Usar logo no cabeçalho."
          />
          <Typography variant="caption">
            Trocará o nome do site no topo pelo logo.
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
