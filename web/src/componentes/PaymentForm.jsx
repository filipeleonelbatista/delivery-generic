import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import React, { useMemo } from "react";
import * as Yup from "yup";
import { useConfig } from "../hooks/useConfig";
import { useLoader } from "../hooks/useLoader";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { useToast } from "../hooks/useToast";

export default function PaymentForm({
  handleBack,
  handleNext,
  activeStep,
  steps,
}) {
  const { selectedPaymentMethod, setselectedPaymentMethod, verifyCupom } =
    useShoppingCart();
  const { config } = useConfig();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      paymentMethod: Yup.string().required(
        "O campo Método de pagamento é obrigatório"
      ),
      cupom: Yup.string().test(
        "cupom-valido",
        "Cupom inválido",
        async (value) => {
          if (value) {
            return verifyCupom(value);
          }
          return true;
        }
      ),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      paymentMethod: selectedPaymentMethod ?? "isMoney",
      cupom: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    setselectedPaymentMethod(formValues.paymentMethod);
    handleNext();
  };
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Método de pagamento
      </Typography>
      <Box
        sx={{
          width: "100%",
          mt: 1,
        }}
      >
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="paymentMethod-label">Método de pagamento</InputLabel>
          <Select
            labelId="paymentMethod-label"
            id="paymentMethod-select"
            value={formik.values.paymentMethod}
            label="Método de pagamento"
            onChange={(event) =>
              formik.setFieldValue("paymentMethod", event.target.value)
            }
          >
            {config.paymentMethodsAccepted.isCredit && (
              <MenuItem display="block" variant="body1" value={"isCredit"}>
                Cartão de crédito
              </MenuItem>
            )}
            {config.paymentMethodsAccepted.isDebit && (
              <MenuItem display="block" variant="body1" value={"isDebit"}>
                Cartão de débito
              </MenuItem>
            )}
            {config.paymentMethodsAccepted.isFoodCard && (
              <MenuItem display="block" variant="body1" value={"isFoodCard"}>
                Cartão Alimentação/Refeição
              </MenuItem>
            )}
            {config.paymentMethodsAccepted.isMoney && (
              <MenuItem display="block" variant="body1" value={"isMoney"}>
                Dinheiro
              </MenuItem>
            )}
            {config.paymentMethodsAccepted.isPix && (
              <MenuItem display="block" variant="body1" value={"isPix"}>
                Pix
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          id="cupom"
          label="Cupom de desconto"
          value={formik.values.cupom}
          onChange={(event) =>
            formik.setFieldValue("cupom", event.target.value)
          }
          error={!!formik.errors.cupom}
          helperText={formik.errors.cupom}
        />
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
