import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import DrawerComponent from "../../../componentes/DrawerComponent";
import { useAuth } from "../../../hooks/useAuth";
import { useCategories } from "../../../hooks/useCategories";
import { useLoader } from "../../../hooks/useLoader";
import { useToast } from "../../../hooks/useToast";
import { uploadImageAsync } from "../../../utils/uploadImageAsync";

export default function AddCategory() {
  const { user } = useAuth();
  const { addCategory } = useCategories();

  const { addToast } = useToast();
  const { setIsLoading } = useLoader();

  const navigate = useNavigate();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      avatar: Yup.string(),
      name: Yup.string().required("O campo Categoria é obrigatório"),
      order: Yup.number(),
      active: Yup.boolean(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      avatar: "",
      name: "",
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
    formik.setFieldValue("avatar", file);

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
  };

  const handleSubmitForm = async (formValues) => {
    try {
      setIsLoading(true);
      let uploadURLImage = await uploadImageAsync(
        formValues.avatar,
        "categorias"
      );

      const data = {
        avatar: uploadURLImage ?? "",
        name: formValues.name,
        order: formValues.order,
        active: formValues.active,
        createdAt: new Date(Date.now()).getTime(),
        createdBy: user.uid,
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await addCategory(data);

      addToast({
        message: "Categoria adicionada com sucesso!",
      });

      navigate("/categorias");
      
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao adicionar categoria!",
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
            onClick={() => navigate("/categorias")}
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
          <IconButton aria-label="Enviar foto" component="label">
            <input
              hidden
              id="avatar"
              name="avatar"
              accept="image/*"
              type="file"
              onChange={(event) => handleFilePreview(event)}
            />
            <Avatar
              sx={{ bgcolor: "primary.light", width: 128, height: 128 }}
              src={selectedImage}
              alt="Foto da categoria"
            >
              <PhotoCameraIcon sx={{ width: 50, height: 50 }} />
            </Avatar>
          </IconButton>
        </Box>
        <TextField
          label="Categoria"
          margin="normal"
          fullWidth
          id="name"
          onChange={(event) => formik.setFieldValue("name", event.target.value)}
          value={formik.values.name}
          helperText={formik.errors.name}
          error={!!formik.errors.name}
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
