import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
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
import { useCupons } from "../../../hooks/useCupons";
import { useLoader } from "../../../hooks/useLoader";
import { useToast } from "../../../hooks/useToast";
import { maskCurrency, parseToFloat } from "../../../utils/formatCurrency";
import { dateToStringInput } from "../../../utils/string";

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

export default function EditCupons() {
  const { user, getUserByID } = useAuth();
  const { updateCupom, selectedCupom } = useCupons();

  const { addToast } = useToast();
  const { setIsLoading } = useLoader();

  const navigate = useNavigate();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      description: Yup.string().required("O campo Descrição é obrigatório"),
      valueDiscount: Yup.string().required("O campo Valor atual é obrigatório"),
      startDate: Yup.string(),
      endDate: Yup.string(),
      active: Yup.boolean(),
      isFreeDelivery: Yup.boolean(),
      isDelivery: Yup.boolean(),
      isPercentage: Yup.boolean(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      description: selectedCupom.description ?? "",
      valueDiscount: selectedCupom.isPercentage
        ? selectedCupom.valueDiscount
        : maskCurrency(selectedCupom.valueDiscount),
      startDate:
        selectedCupom.startDate !== ""
          ? dateToStringInput(new Date(selectedCupom.startDate))
          : "",
      endDate:
        selectedCupom.endDate !== ""
          ? dateToStringInput(new Date(selectedCupom.endDate))
          : "",
      active: selectedCupom.active ?? true,
      isFreeDelivery: selectedCupom.isFreeDelivery ?? false,
      isDelivery: selectedCupom.isDelivery ?? false,
      isPercentage: selectedCupom.isPercentage ?? false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    try {
      setIsLoading(true);

      const submittedDate =
        formValues.startDate !== "" && formValues.startDate.split("/");
      const submittedDate2 =
        formValues.endDate !== "" && formValues.endDate.split("/");

      const data = {
        ...selectedCupom,
        description: formValues.description ?? "",
        valueDiscount: parseToFloat(formValues.valueDiscount),
        startDate:
          formValues.startDate !== ""
            ? new Date(
                `${submittedDate[2]}-${submittedDate[1]}-${submittedDate[0]}`
              ).getTime() + 43200000
            : "",
        endDate:
          formValues.endDate !== ""
            ? new Date(
                `${submittedDate2[2]}-${submittedDate2[1]}-${submittedDate2[0]}`
              ).getTime() + 43200000
            : "",
        active: formValues.active,
        isFreeDelivery: formValues.isFreeDelivery,
        isDelivery: formValues.isDelivery,
        isPercentage: formValues.isPercentage,
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await updateCupom(data);

      addToast({
        message: "Cupom atualizado com sucesso!",
      });

      navigate("/descontos");
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao atualizar cupom!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [updatedDataInfo, setUpdatedDataInfo] = useState();

  useEffect(() => {
    const executeAsync = async () => {
      const createdBy = await getUserByID(selectedCupom.createdBy);
      const updatedBy = await getUserByID(selectedCupom.updatedBy);

      setUpdatedDataInfo({
        createdBy,
        updatedBy,
      });
    };
    executeAsync();
  }, [selectedCupom, getUserByID]);

  return (
    <DrawerComponent
      title="Editar cupom"
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
            onClick={() => navigate("/descontos")}
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
          label="Descrição"
          margin="normal"
          fullWidth
          id="description"
          onChange={(event) =>
            formik.setFieldValue("description", event.target.value)
          }
          value={formik.values.description}
          helperText={formik.errors.description}
          error={!!formik.errors.description}
        />
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel htmlFor="valueDiscount">Valor atual</InputLabel>
          <OutlinedInput
            label="Valor atual"
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                {formik.values.isPercentage ? "%" : "R$"}
              </InputAdornment>
            }
            id="valueDiscount"
            onChange={(event) =>
              formik.setFieldValue(
                "valueDiscount",
                formik.values.isPercentage
                  ? event.target.value
                  : maskCurrency(event.target.value)
              )
            }
            value={formik.values.valueDiscount}
            error={!!formik.errors.valueDiscount}
          />

          {!!formik.errors.valueDiscount && (
            <FormHelperText
              error={!!formik.errors.valueDiscount}
              id="valueDiscount-helper-text"
            >
              {formik.errors.valueDiscount}
            </FormHelperText>
          )}
        </FormControl>

        <Stack direction="row" spacing={2} marginY={1}>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="startDate">Data de inicio</InputLabel>
            <OutlinedInput
              label="Data de inicio"
              fullWidth
              type="date"
              startAdornment={
                <InputAdornment position="start">
                  <CalendarMonthIcon />
                </InputAdornment>
              }
              id="startDate"
              onChange={(event) =>
                formik.setFieldValue("startDate", event.target.value)
              }
              value={formik.values.startDate}
              error={!!formik.errors.startDate}
            />

            {!!formik.errors.startDate && (
              <FormHelperText
                error={!!formik.errors.startDate}
                id="startDate-helper-text"
              >
                {formik.errors.startDate}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="endDate">Data de fim</InputLabel>
            <OutlinedInput
              label="Data de fim"
              margin="normal"
              type="date"
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <CalendarMonthIcon />
                </InputAdornment>
              }
              id="endDate"
              onChange={(event) =>
                formik.setFieldValue("endDate", event.target.value)
              }
              value={formik.values.endDate}
              error={!!formik.errors.endDate}
            />

            {!!formik.errors.endDate && (
              <FormHelperText
                error={!!formik.errors.endDate}
                id="endDate-helper-text"
              >
                {formik.errors.endDate}
              </FormHelperText>
            )}
          </FormControl>
        </Stack>
        <Stack direction="column" marginY={1}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) => {
                  formik.setFieldValue("isDelivery", event.target.checked);
                  formik.setFieldValue("valueDiscount", "0,00");
                }}
                checked={formik.values.isDelivery}
                color="primary"
              />
            }
            label="Desconto no frete"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) => {
                  formik.setFieldValue("isFreeDelivery", event.target.checked);
                  formik.setFieldValue("valueDiscount", "0,00");
                }}
                checked={formik.values.isFreeDelivery}
                color="primary"
              />
            }
            label="Frete grátis"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) => {
                  formik.setFieldValue("isPercentage", event.target.checked);
                  formik.setFieldValue("valueDiscount", "1");
                }}
                checked={formik.values.isPercentage}
                color="primary"
              />
            }
            label="Valor do desconto em percentual"
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
            label="Habilitado"
          />
        </Stack>
        <Stack>
          <Typography>
            <b>Criado por:</b> {updatedDataInfo?.createdBy?.name ?? ""} em{" "}
            {dayjs().from(dayjs(new Date(selectedCupom?.createdAt)), true)}
          </Typography>
          <Typography>
            <b>Atualizado por:</b> {updatedDataInfo?.updatedBy?.name ?? ""} em{" "}
            {dayjs().from(dayjs(new Date(selectedCupom?.updatedAt)), true)}
          </Typography>
        </Stack>
      </Box>
    </DrawerComponent>
  );
}
