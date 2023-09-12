import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import * as Yup from "yup";

import { useAuth } from "../../../hooks/useAuth";
import { useConfig } from "../../../hooks/useConfig";
import { useLoader } from "../../../hooks/useLoader";
import { useToast } from "../../../hooks/useToast";

export default function StoreConfig() {
  const { config, updateConfig } = useConfig();
  const { setIsLoading } = useLoader();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [horariosAtendimento, setHorariosAtendimento] = useState(
    config.openingHours ?? []
  );

  const validationSchemaDate = Yup.object().shape({
    diaSemana: Yup.string().required("O dia da semana é obrigatório"),
    horarios: Yup.array()
      .of(
        Yup.string().matches(
          /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
          "Formato de hora inválido (HH:mm)"
        )
      )
      .min(1, "Pelo menos um horário deve ser selecionado")
      .max(4, "No máximo quatro horários podem ser selecionados"),
  });

  const formikDate = useFormik({
    initialValues: {
      diaSemana: "",
      horarios: [],
    },
    validationSchemaDate,
    onSubmit: (values) => {
      console.log(values);
      handleSubmit(values);
    },
  });

  const handleSubmit = (values) => {
    const novoHorario = {
      diaSemana: values.diaSemana,
      horarios: values.horarios,
    };

    setHorariosAtendimento([...horariosAtendimento, novoHorario]);
  };

  const handleDelete = (diaSemana) => {
    if (confirm("Deseja remover os horários desse dia?")) {
      const updatedHorarios = horariosAtendimento.filter(
        (horario) => horario.diaSemana !== diaSemana
      );
      setHorariosAtendimento(updatedHorarios);
    }
  };

  function getDiaSemanaPorExtenso(diaSemana) {
    switch (diaSemana) {
      case "segunda":
        return "Segunda-feira";
      case "terca":
        return "Terça-feira";
      case "quarta":
        return "Quarta-feira";
      case "quinta":
        return "Quinta-feira";
      case "sexta":
        return "Sexta-feira";
      case "sabado":
        return "Sábado";
      case "domingo":
        return "Domingo";
      default:
        return "";
    }
  }

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      isStoreOpen: Yup.boolean(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      isStoreOpen: config.isStoreOpen ?? false,
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
        isStoreOpen: formValues.isStoreOpen,
        openingHours: horariosAtendimento,
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await updateConfig(data);

      addToast({
        message: "Horarios de atendimento atualizados!",
      });
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao atualizar Horarios de atendimento!",
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
        <Stack direction="column" sx={{ mb: 4 }} spacing={1}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={(event) =>
                  formik.setFieldValue("isStoreOpen", event.target.checked)
                }
                checked={formik.values.isStoreOpen}
                color="primary"
              />
            }
            label="Loja fechada."
          />
          <Typography variant="caption">
            O Site continuará funcionando mas, ao tentar finalizar o pedido, o
            usuário será informado que a loja está fechada no momento. Ideal
            caso haja uma emergência.
          </Typography>
        </Stack>

        <Stack direction="column" sx={{ my: 2 }} spacing={1}>
          <Typography variant="h6">Horários de funcionamento</Typography>
          <Typography variant="body2">
            Defina horarios de funcionamento, assim seu cliente será informado
            caso seu negócios esteja fechado.
          </Typography>
          <Stack
            component="form"
            direction="row"
            spacing={2}
            sx={{ py: 2 }}
            onSubmit={formikDate.handleSubmit}
          >
            <FormControl fullWidth>
              <InputLabel>Dia da Semana</InputLabel>
              <Select
                name="diaSemana"
                label="Dia da Semana"
                value={formikDate.values.diaSemana}
                onChange={formikDate.handleChange}
                onBlur={formikDate.handleBlur}
                error={
                  formikDate.touched.diaSemana &&
                  Boolean(formikDate.errors.diaSemana)
                }
              >
                <MenuItem value="segunda">Segunda-feira</MenuItem>
                <MenuItem value="terca">Terça-feira</MenuItem>
                <MenuItem value="quarta">Quarta-feira</MenuItem>
                <MenuItem value="quinta">Quinta-feira</MenuItem>
                <MenuItem value="sexta">Sexta-feira</MenuItem>
                <MenuItem value="sabado">Sábado</MenuItem>
                <MenuItem value="domingo">Domingo</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Horários</InputLabel>
              <Select
                name="horarios"
                label="Horários"
                multiple
                value={formikDate.values.horarios}
                onChange={formikDate.handleChange}
                onBlur={formikDate.handleBlur}
                renderValue={(selected) => selected.join(", ")}
                error={
                  formikDate.touched.horarios &&
                  Boolean(formikDate.errors.horarios)
                }
              >
                {[
                  "00:00",
                  "00:30",
                  "01:00",
                  "01:30",
                  "02:00",
                  "02:30",
                  "03:00",
                  "03:30",
                  "04:00",
                  "04:30",
                  "05:00",
                  "05:30",
                  "06:00",
                  "06:30",
                  "07:00",
                  "07:30",
                  "08:00",
                  "08:30",
                  "09:00",
                  "09:30",
                  "10:00",
                  "10:30",
                  "11:00",
                  "11:30",
                  "12:00",
                  "12:30",
                  "13:00",
                  "13:30",
                  "14:00",
                  "14:30",
                  "15:00",
                  "15:30",
                  "16:00",
                  "16:30",
                  "17:00",
                  "17:30",
                  "18:00",
                  "18:30",
                  "19:00",
                  "19:30",
                  "20:00",
                  "20:30",
                  "21:00",
                  "21:30",
                  "22:00",
                  "22:30",
                  "23:00",
                  "23:30",
                ].map((horario) => (
                  <MenuItem key={horario} value={horario}>
                    {horario}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
              <AddIcon />
            </Button>
          </Stack>
          {horariosAtendimento.length > 0 &&
            horariosAtendimento.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={4}
                sx={{ alignItems: "center" }}
              >
                <Typography>
                  <b>{getDiaSemanaPorExtenso(item.diaSemana)}</b>
                </Typography>
                <Stack direction="row" spacing={1}>
                  {item.horarios.map((horario, indexHorario) => (
                    <Typography key={indexHorario}>{horario}</Typography>
                  ))}
                </Stack>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => handleDelete(item.diaSemana)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
        </Stack>
      </Box>
    </Stack>
  );
}
