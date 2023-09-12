import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import DrawerComponent from "../../../componentes/DrawerComponent";
import { useAuth } from "../../../hooks/useAuth";
import { useBanners } from "../../../hooks/useBanners";
import { useLoader } from "../../../hooks/useLoader";
import { useToast } from "../../../hooks/useToast";
import { uploadImageAsync } from "../../../utils/uploadImageAsync";

export default function AddBanner() {
  const { user } = useAuth();
  const { addBanner } = useBanners();

  const { addToast } = useToast();
  const { setIsLoading } = useLoader();

  const navigate = useNavigate();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      image: Yup.string(),
      title: Yup.string().required("O campo Titulo é obrigatório"),
      subtitle: Yup.string(),
      refference: Yup.string(),
      order: Yup.number(),
      active: Yup.boolean(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      image: "",
      title: "",
      subtitle: "",
      reference: "",
      order: 0,
      active: true,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const [selectedImage, setSelectedImage] = useState("");

  const handleFilePreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    formik.setFieldValue("image", file);

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
  };

  const handleSubmitForm = async (formValues) => {
    try {
      setIsLoading(true);
      let uploadURLImage = await uploadImageAsync(formValues.image, "banners");

      const data = {
        image: uploadURLImage ?? "",
        title: formValues.title,
        subtitle: formValues.subtitle,
        reference: formValues.reference,
        order: formValues.order,
        active: formValues.active,
        createdAt: new Date(Date.now()).getTime(),
        createdBy: user.uid,
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await addBanner(data);

      addToast({
        message: "Banner adicionado com sucesso!",
      });

      navigate("/banners");
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao adicionar Banner!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DrawerComponent
      title="Adicionar Categoria"
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
            onClick={() => navigate("/banners")}
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
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            sx={{ width: "100%" }}
            aria-label="Enviar foto"
            component="label"
          >
            <input
              hidden
              id="image"
              title="image"
              accept="image/*"
              type="file"
              onChange={(event) => handleFilePreview(event)}
            />
            {selectedImage ? (
              <CardMedia
                sx={{ width: "100%", height: 180 }}
                image={selectedImage}
                alt="Foto da categoria"
              />
            ) : (
              <Avatar
                sx={{ bgcolor: "primary.light", width: 128, height: 128 }}
                src={null}
                alt="Foto da categoria"
              >
                <PhotoCameraIcon sx={{ width: 50, height: 50 }} />
              </Avatar>
            )}
          </Button>
        </Box>
        <TextField
          label="Titulo"
          margin="normal"
          fullWidth
          id="title"
          onChange={(event) =>
            formik.setFieldValue("title", event.target.value)
          }
          value={formik.values.title}
          helperText={formik.errors.title}
          error={!!formik.errors.title}
        />
        <TextField
          label="Subtitulo"
          margin="normal"
          fullWidth
          id="subtitle"
          onChange={(event) =>
            formik.setFieldValue("subtitle", event.target.value)
          }
          value={formik.values.subtitle}
          helperText={formik.errors.subtitle}
          error={!!formik.errors.subtitle}
        />
        <TextField
          label="Link"
          margin="normal"
          fullWidth
          id="reference"
          onChange={(event) =>
            formik.setFieldValue("reference", event.target.value)
          }
          value={formik.values.reference}
          helperText={formik.errors.reference}
          error={!!formik.errors.reference}
        />
        <TextField
          label="Ordem"
          margin="normal"
          type="number"
          fullWidth
          id="order"
          onChange={(event) =>
            formik.setFieldValue("order", Number(event.target.value))
          }
          value={formik.values.order}
          helperText={formik.errors.order}
          error={!!formik.errors.order}
        />

        <FormControlLabel
          control={
            <Checkbox
              onChange={(event) =>
                formik.setFieldValue("active", event.target.checked)
              }
              checked={formik.values.active}
              color="primary"
            />
          }
          label="Habilitada"
        />
      </Box>
    </DrawerComponent>
  );
}
