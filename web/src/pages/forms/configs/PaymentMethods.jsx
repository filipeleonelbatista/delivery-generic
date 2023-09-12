import SaveIcon from "@mui/icons-material/Save";

import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as Yup from "yup";

import { useAuth } from "../../../hooks/useAuth";
import { useConfig } from "../../../hooks/useConfig";
import { useLoader } from "../../../hooks/useLoader";
import { useToast } from "../../../hooks/useToast";

export default function PaymentMethods() {
  const { config, updateConfig } = useConfig();
  const { setIsLoading } = useLoader();
  const { addToast } = useToast();
  const { user } = useAuth();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      isCredit: Yup.boolean(),
      isDebit: Yup.boolean(),
      isFoodCard: Yup.boolean(),
      isMoney: Yup.boolean(),
      isPix: Yup.boolean(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      isCredit: config.paymentMethodsAccepted.isCredit,
      isDebit: config.paymentMethodsAccepted.isDebit,
      isFoodCard: config.paymentMethodsAccepted.isFoodCard,
      isMoney: config.paymentMethodsAccepted.isMoney,
      isPix: config.paymentMethodsAccepted.isPix,
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
        paymentMethodsAccepted: {
          isCredit: formValues.isCredit,
          isDebit: formValues.isDebit,
          isFoodCard: formValues.isFoodCard,
          isMoney: formValues.isMoney,
          isPix: formValues.isPix,
        },
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: user.uid,
      };

      await updateConfig(data);

      addToast({
        message: "Métodos de pagamento atualizados!",
      });
    } catch (error) {
      console.log("handleSubmit error", error);

      addToast({
        severity: "error",
        message: "Erro ao Atualizar os Métodos de pagamento!",
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
        <Typography>Habilite Métodos de pagamento para seu cliente.</Typography>

        <Stack direction="column" spacing={1} sx={{ my: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isCredit}
                onChange={(event) =>
                  formik.setFieldValue("isCredit", event.target.checked)
                }
              />
            }
            label="Cartão de crédito"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isDebit}
                onChange={(event) =>
                  formik.setFieldValue("isDebit", event.target.checked)
                }
              />
            }
            label="Cartão de débito"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isMoney}
                onChange={(event) =>
                  formik.setFieldValue("isMoney", event.target.checked)
                }
              />
            }
            label="Dinheiro"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isPix}
                onChange={(event) =>
                  formik.setFieldValue("isPix", event.target.checked)
                }
              />
            }
            label="Pix"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formik.values.isFoodCard}
                onChange={(event) =>
                  formik.setFieldValue("isFoodCard", event.target.checked)
                }
              />
            }
            label="Vale Refeição/Alimentação"
          />
        </Stack>
      </Box>
    </Stack>
  );
}
