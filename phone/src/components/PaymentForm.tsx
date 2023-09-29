import {
  Button,
  ButtonText,
  ChevronDownIcon,
  config as defaultConfig,
  HStack,
  Icon,
  Input,
  InputField,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useConfig } from "../hooks/useConfig";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { useFormik } from "formik";
import React, { useMemo } from "react";
import * as Yup from "yup";

export default function Review({ handleBack, handleNext, activeStep, steps }) {
  const navigation = useNavigation();
  const { colors } = defaultConfig.theme.tokens;

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
    <VStack space="md">
      <Text fontSize={"$xl"}>Método de pagamento</Text>

      <VStack space="sm">
        <Text fontWeight="$semibold">Método de pagamento</Text>
        <Select
          onValueChange={(value) =>
            formik.setFieldValue("paymentMethod", value)
          }
        >
          <SelectTrigger variant="outline" size="md">
            <SelectInput placeholder="Selecione um método de pagamento" />
            <SelectIcon mr="$3">
              <Icon as={ChevronDownIcon} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent sx={{ height: 400 }}>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {config.paymentMethodsAccepted.isCredit && (
                <SelectItem label="Cartão de crédito" value="isCredit" />
              )}
              {config.paymentMethodsAccepted.isDebit && (
                <SelectItem label="Cartão de débito" value="isDebit" />
              )}
              {config.paymentMethodsAccepted.isFoodCard && (
                <SelectItem
                  label="Cartão Alimentação/Refeição"
                  value="isFoodCard"
                />
              )}
              {config.paymentMethodsAccepted.isMoney && (
                <SelectItem label="Dinheiro" value="isMoney" />
              )}
              {config.paymentMethodsAccepted.isPix && (
                <SelectItem label="Pix" value="isPix" />
              )}
            </SelectContent>
          </SelectPortal>
        </Select>

        {!!formik.errors.paymentMethod && (
          <Text fontSize={"$sm"} color="$red400">
            {formik.errors.paymentMethod}
          </Text>
        )}
      </VStack>
      <VStack space="sm">
        <Text fontWeight="$semibold">Cupom de desconto</Text>
        <Input
          isInvalid={!!formik.errors.cupom}
          sx={{
            w: "100%",
            ":focus": {
              borderColor: "$red600",
            },
          }}
          size="md"
          isDisabled={false}
        >
          <InputField
            value={formik.values.cupom}
            onChangeText={(text) => formik.setFieldValue("cupom", text)}
            placeholderTextColor={"#666"}
          />
        </Input>
        {!!formik.errors.cupom && (
          <Text fontSize={"$sm"} color="$red400">
            {formik.errors.cupom}
          </Text>
        )}
      </VStack>

      <HStack justifyContent="flex-end" space="sm">
        {activeStep !== 0 && (
          <Button
            sx={{
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "$red600",
              ":active": {
                borderColor: "$red800",
              },
            }}
            variant="outline"
            onPress={handleBack}
          >
            <ButtonText color="$red600">Voltar</ButtonText>
          </Button>
        )}

        <Button
          bg="$red600"
          sx={{
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ":active": {
              bgColor: "$red800",
            },
          }}
          onPress={formik.handleSubmit}
        >
          <ButtonText>
            {activeStep === steps.length - 1 ? "Enviar pedido" : "Próximo"}
          </ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}
