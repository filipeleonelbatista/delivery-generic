import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import DrawerComponent from "../../../componentes/DrawerComponent";
import { useAuth } from "../../../hooks/useAuth";
import { useCategories } from "../../../hooks/useCategories";
import { useLoader } from "../../../hooks/useLoader";
import { useProducts } from "../../../hooks/useProducts";
import { useToast } from "../../../hooks/useToast";
import deleteImageFromStorage from "../../../utils/deleteImageFromStorage";
import { maskCurrency, parseToFloat } from "../../../utils/formatCurrency";
import { uploadImageAsync } from "../../../utils/uploadImageAsync";

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

export default function EditProduct() {
  const { user, getUserByID } = useAuth();
  const { categoriesList } = useCategories();
  const { updateProduct, selectedProduct } = useProducts();

  const { addToast } = useToast();
  const { setIsLoading } = useLoader();

  const navigate = useNavigate();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      featuredImage: Yup.string(),
      name: Yup.string().required("O campo Produto é obrigatório"),
      description: Yup.string(),
      categoryId: Yup.string().required("O campo Categoria é obrigatório"),
      currentValue: Yup.string().required("O campo Valor atual é obrigatório"),
      previousValue: Yup.string(),
      active: Yup.boolean(),
      isFeatured: Yup.boolean(),
      hasDiscount: Yup.boolean(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      featuredImage: "",
      description: selectedProduct?.description ?? "",
      name: selectedProduct?.name ?? "",
      categoryId: selectedProduct?.categoryId ?? "",
      currentValue:
        selectedProduct?.currentValue !== ""
          ? maskCurrency(selectedProduct?.currentValue)
          : "",
      previousValue:
        selectedProduct?.previousValue !== ""
          ? maskCurrency(selectedProduct?.previousValue)
          : "",
      active: selectedProduct?.active,
      isFeatured: selectedProduct?.isFeatured,
      hasDiscount: selectedProduct?.hasDiscount,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const [selectedImage, setSelectedImage] = useState(
    selectedProduct.featuredImage ?? ""
  );

  const handleFilePreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    formik.setFieldValue("featuredImage", file);

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
  };

  const handleSubmitForm = async (formValues) => {
    try {
      setIsLoading(true);
      let uploadURLImage = "";

      if (formValues.featuredImage !== "") {
        deleteImageFromStorage(selectedProduct.featuredImage);
        uploadURLImage = await uploadImageAsync(
          formValues.featuredImage,
          "produtos"
        );
      } else {
        uploadURLImage = selectedImage;
      }

      const data = {
        ...selectedProduct,
        featuredImage: uploadURLImage ?? "",
        description: formValues.description ?? "",
        name: formValues.name,
        categoryId: formValues.categoryId,
        currentValue: parseToFloat(formValues.currentValue),
        previousValue:
          formValues.previousValue !== ""
            ? parseFloat(formValues.previousValue)
            : "",
        active: formValues.active,
        hasDiscount: formValues.hasDiscount,
        isFeatured: formValues.isFeatured,
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await updateProduct(data);

      addToast({
        message: "Produto atualizado com sucesso!",
      });

      navigate("/produtos");
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao atualizar produto!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [updatedDataInfo, setUpdatedDataInfo] = useState();

  useEffect(() => {
    const executeAsync = async () => {
      const createdBy = await getUserByID(selectedProduct.createdBy);
      const updatedBy = await getUserByID(selectedProduct.updatedBy);

      setUpdatedDataInfo({
        createdBy,
        updatedBy,
      });
    };
    executeAsync();
  }, [selectedProduct, getUserByID]);

  return (
    <DrawerComponent
      title="Editar produto"
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
            onClick={() => navigate("/produtos")}
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
              id="featuredImage"
              name="featuredImage"
              accept="image/*"
              type="file"
              onChange={(event) => handleFilePreview(event)}
            />
            <Avatar
              sx={{ bgcolor: "primary.light", width: 128, height: 128 }}
              src={selectedImage}
              alt="Foto destacada"
            >
              <PhotoCameraIcon sx={{ width: 50, height: 50 }} />
            </Avatar>
          </IconButton>
        </Box>
        <TextField
          label="Produto"
          margin="normal"
          fullWidth
          id="name"
          onChange={(event) => formik.setFieldValue("name", event.target.value)}
          value={formik.values.name}
          helperText={formik.errors.name}
          error={!!formik.errors.name}
        />
        <FormControl fullWidth>
          <InputLabel id="categoryId">Categoria</InputLabel>
          <Select
            labelId="categoryId"
            id="categoryId"
            value={formik.values.categoryId}
            label="Categoria"
            onChange={(event) =>
              formik.setFieldValue("categoryId", event.target.value)
            }
          >
            {categoriesList.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>

          {!!formik.errors.categoryId && (
            <FormHelperText
              error={!!formik.errors.categoryId}
              id="categoryId-helper-text"
            >
              {formik.errors.categoryId}
            </FormHelperText>
          )}
        </FormControl>
        <TextField
          label="Descrição"
          margin="normal"
          fullWidth
          multiline
          rows={4}
          id="description"
          onChange={(event) =>
            formik.setFieldValue("description", event.target.value)
          }
          value={formik.values.description}
          helperText={formik.errors.description}
          error={!!formik.errors.description}
        />
        <Stack direction="row" spacing={2} marginY={1}>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="currentValue">Valor atual</InputLabel>
            <OutlinedInput
              label="Valor atual"
              margin="normal"
              fullWidth
              startAdornment={
                <InputAdornment position="start">R$</InputAdornment>
              }
              id="currentValue"
              onChange={(event) =>
                formik.setFieldValue(
                  "currentValue",
                  maskCurrency(event.target.value)
                )
              }
              value={formik.values.currentValue}
              error={!!formik.errors.currentValue}
            />

            {!!formik.errors.currentValue && (
              <FormHelperText
                error={!!formik.errors.currentValue}
                id="currentValue-helper-text"
              >
                {formik.errors.currentValue}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="outlined-adornment-amount">
              Valor anterior
            </InputLabel>
            <OutlinedInput
              label="Valor anterior"
              margin="normal"
              disabled={!formik.values.hasDiscount}
              fullWidth
              startAdornment={
                <InputAdornment position="start">R$</InputAdornment>
              }
              id="previousValue"
              onChange={(event) =>
                formik.setFieldValue(
                  "previousValue",
                  maskCurrency(event.target.value)
                )
              }
              value={formik.values.previousValue}
              error={!!formik.errors.previousValue}
            />

            {!!formik.errors.previousValue && (
              <FormHelperText
                error={!!formik.errors.previousValue}
                id="previousValue-helper-text"
              >
                {formik.errors.previousValue}
              </FormHelperText>
            )}
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={2} marginY={1}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) =>
                  formik.setFieldValue("isFeatured", event.target.checked)
                }
                checked={formik.values.isFeatured}
                color="primary"
              />
            }
            label="Em destaque"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) => {
                  if (event.target.checked) {
                    formik.setFieldValue(
                      "previousValue",
                      formik.values.currentValue
                    );
                  } else {
                    formik.setFieldValue("previousValue", "");
                  }
                  formik.setFieldValue("hasDiscount", event.target.checked);
                }}
                checked={formik.values.hasDiscount}
                color="primary"
              />
            }
            label="Habilitar o desconto"
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
        </Stack>

        <Stack>
          <Typography>
            <b>Criado por:</b> {updatedDataInfo?.createdBy?.name ?? ""} em{" "}
            {dayjs().from(dayjs(new Date(selectedProduct?.createdAt)), true)}
          </Typography>
          <Typography>
            <b>Atualizado por:</b> {updatedDataInfo?.updatedBy?.name ?? ""} em{" "}
            {dayjs().from(dayjs(new Date(selectedProduct?.updatedAt)), true)}
          </Typography>
        </Stack>
      </Box>
    </DrawerComponent>
  );
}
