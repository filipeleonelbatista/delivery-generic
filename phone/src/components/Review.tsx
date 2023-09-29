import { Feather } from "@expo/vector-icons";
import {
  Button,
  ButtonText,
  config as defaultConfig,
  Divider,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
  Textarea,
  TextareaInput,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useConfig } from "../hooks/useConfig";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { useToast } from "../hooks/useToast";
import { calcularDistancia } from "../utils/calcularDistancia";
import { formatCurrency } from "../utils/formatCurrency";
import NoData from "./NoData";

export default function PaymentForm({
  handleBack,
  handleNext,
  activeStep,
  steps,
}) {
  const navigation = useNavigation();
  const { colors } = defaultConfig.theme.tokens;

  const {
    productsList,
    totalShoppingCart,
    handleRemoveProductFromCart,
    updateQuantity,
    userInfo,
    selectedPaymentMethod,
    isDelivery,
    cupom,
    createOrderFromSite,
  } = useShoppingCart();

  const { config } = useConfig();
  const { addToast } = useToast();

  const [coords, setCoords] = useState();

  useEffect(() => {
    // navigator.geolocation.getCurrentPosition((position) => {
    //   const { latitude, longitude } = position.coords;
    //   setCoords({ lat: latitude, lng: longitude });
    // });
  }, []);

  const dinamicDeliveryValue = useMemo(() => {
    if (isDelivery === "Retirada") {
      return 0;
    }
    if (coords) {
      const distance = calcularDistancia(config.location, coords);
      const result = distance * config.deliveryTaxValue;
      return result > config.deliveryTaxValue
        ? result
        : config.deliveryTaxValue;
    }
    return 0;
  }, [coords]);

  const dinamicCupomValue = useMemo(() => {
    if (cupom) {
      if (cupom.isDelivery) {
        return dinamicDeliveryValue - cupom.valueDiscount ?? 0;
      } else if (cupom.isFreeDelivery) {
        return dinamicDeliveryValue ?? 0;
      } else if (cupom.isPercentage) {
        return totalShoppingCart * (cupom.valueDiscount / 100) ?? 0;
      } else {
        return cupom.valueDiscount;
      }
    }
    return 0;
  }, [cupom, totalShoppingCart, dinamicDeliveryValue]);

  const generalTotal = useMemo(() => {
    return totalShoppingCart + dinamicDeliveryValue - dinamicCupomValue;
  }, [totalShoppingCart, dinamicDeliveryValue, dinamicCupomValue]);

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      observation: Yup.string(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      observation: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    const data = {
      clientId: userInfo.id ?? "",
      clientObject: userInfo,
      deliveryType: isDelivery,
      subtotal: totalShoppingCart,
      total: generalTotal,
      discount: dinamicCupomValue,
      cupomObject: cupom,
      deliveryValue: dinamicDeliveryValue,
      status: "Aberto",
      paymentMethod: selectedPaymentMethod,
      observation: formValues.observation,
      items: productsList,
      createdAt: new Date(Date.now()).getTime(),
      createdBy: "App",
      updatedAt: new Date(Date.now()).getTime(),
      updatedBy: "App",
    };

    console.log("DATA", data);

    // const response = await createOrderFromSite(data);

    // if (response.id) {
    //   addToast({
    //     severity: "success",
    //     message: "Pedido criado!",
    //   });

    //   localStorage.setItem("@currentOrder", response.id);

    //   navigate(`/acompanharPedido?pedido=${response.id}`);
    // } else {
    //   addToast({
    //     severity: "error",
    //     message:
    //       "Tivemos um problema ao criar seu pedido, tente novamente mais tarde!",
    //   });
    // }
  };

  return (
    <VStack space="md">
      <Text fontSize={"$xl"}>Produtos</Text>

      {productsList.length > 0 ? (
        productsList.map((product, index) => (
          <HStack key={index} space="sm" alignItems="center">
            <Pressable
              onPress={() => handleRemoveProductFromCart(index)}
              borderRadius="$full"
              w={30}
              h={30}
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
            >
              <Feather name="trash" size={18} color="white" />
            </Pressable>
            <Image
              borderRadius={"$sm"}
              w={80}
              h={80}
              source={{ uri: product?.productObject?.featuredImage }}
            />
            <VStack flex={1}>
              <Heading numberOfLines={1} lineHeight={"$sm"} fontSize={"$sm"}>
                {product?.productObject.name}
              </Heading>

              <Text lineHeight={"$sm"} fontSize={"$sm"} color="$coolGray700">
                {product?.quantity}
                {" X "}
                {product?.productObject?.currentValue?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  useGrouping: true,
                })}
              </Text>
              <HStack space={"md"}>
                <Pressable
                  onPress={() => updateQuantity(index, "adicionar")}
                  borderRadius="$full"
                  w={30}
                  h={30}
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
                >
                  <Feather name="plus" size={18} color="white" />
                </Pressable>
                <Pressable
                  onPress={() => updateQuantity(index, "remover")}
                  borderRadius="$full"
                  w={30}
                  h={30}
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
                >
                  <Feather name="minus" size={18} color="white" />
                </Pressable>
              </HStack>
            </VStack>
            <Heading numberOfLines={1} lineHeight={"$sm"} fontSize={"$md"}>
              {formatCurrency(product.quantity * product.unityAmount)}
            </Heading>
          </HStack>
        ))
      ) : (
        <NoData
          primaryColor={colors.red600}
          description={
            <VStack sx={{ maxWidth: "90%" }}>
              <Text textAlign="center" fontSize={"$sm"}>
                Sem produtos cadastrados no momento. Adicione produtos ao
                carrinho de compras e eles aparecerão aqui
              </Text>
              <Button
                onPress={() => {
                  navigation.navigate("Products");
                }}
                bg="$red600"
                borderRadius={"$full"}
                sx={{
                  my: 16,
                  ":active": {
                    bgColor: "$red800",
                  },
                }}
              >
                <ButtonText>Ir para produtos</ButtonText>
              </Button>
            </VStack>
          }
          style={{
            width: 180,
            height: 180,
          }}
        />
      )}

      {productsList.length > 0 && (
        <HStack justifyContent="space-between">
          <Text fontSize={"$md"}>Subtotal</Text>
          <Text fontSize={"$md"} fontWeight="$bold">
            {formatCurrency(totalShoppingCart)}
          </Text>
        </HStack>
      )}

      {isDelivery === "Entrega" && (
        <HStack justifyContent="space-between">
          <Text fontSize={"$md"}>Frete</Text>
          <Text fontSize={"$md"} fontWeight="$bold">
            {config.isFixedDeliveryTax
              ? formatCurrency(config.deliveryTaxValue)
              : formatCurrency(dinamicDeliveryValue)}
          </Text>
        </HStack>
      )}

      <HStack justifyContent="space-between">
        <Text fontSize={"$md"}>
          Cupom de desconto: {cupom ? cupom.description : ""}
        </Text>
        <Text fontSize={"$md"} fontWeight="$bold">
          -{formatCurrency(dinamicCupomValue)}
        </Text>
      </HStack>

      <HStack justifyContent="space-between">
        <Text fontSize={"$md"}>Total</Text>
        <Text fontSize={"$md"} fontWeight="$bold">
          {formatCurrency(generalTotal)}
        </Text>
      </HStack>

      <Divider />

      <VStack>
        {isDelivery === "Entrega" ? (
          <>
            <Text fontSize={"$xl"}>Entrega</Text>
            <Text>{userInfo.name}</Text>
            <Text>
              {`${userInfo.street}, ${userInfo.number}, ${userInfo.neigborhood}, ${userInfo.city}-${userInfo.state}, CEP: ${userInfo.zipcode}`}
            </Text>
          </>
        ) : (
          <>
            <Text fontSize={"$xl"}>Retirada</Text>
            <Text>
              {`${config.street}, ${config.number}, ${config.neigborhood}, ${config.city}-${config.state}, CEP: ${config.zipcode}`}
            </Text>
          </>
        )}
      </VStack>

      <Divider />

      <VStack>
        <Text fontSize={"$xl"}>Método de pagamento</Text>
        <Text>
          {selectedPaymentMethod === "isCredit" && "Cartão de crédito"}
          {selectedPaymentMethod === "isDebit" && "Cartão de débito"}
          {selectedPaymentMethod === "isFoodCard" &&
            "Cartão Alimentação/Refeição"}
          {selectedPaymentMethod === "isMoney" && "Dinheiro"}
          {selectedPaymentMethod === "isPix" && "Pix"}
        </Text>
      </VStack>

      <Divider />
      <VStack space="sm">
        <Text fontWeight="$semibold">Observações</Text>

        <Textarea
          sx={{
            w: "100%",
            ":focus": {
              borderColor: "$red600",
            },
          }}
          size="md"
          isInvalid={!!formik.errors.observation}
        >
          <TextareaInput
            value={formik.values.observation}
            onChangeText={(text) => formik.setFieldValue("observation", text)}
            placeholderTextColor={"#666"}
            placeholder="Digite suas observações aqui..."
          />
        </Textarea>

        {!!formik.errors.observation && (
          <Text fontSize={"$sm"} color="$red400">
            {formik.errors.observation}
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
