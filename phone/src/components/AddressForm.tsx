import {
  Button,
  ButtonText,
  config as defaultConfig,
  Divider,
  HStack,
  Input,
  InputField,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useLoader } from "../hooks/useLoader";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { useToast } from "../hooks/useToast";
import * as Yup from "yup";
import { useFormik } from "formik";
import React, { useMemo } from "react";
import { celular, cep, cpf, isStringEmpty } from "../utils/string";
import { getCepInformation } from "../utils/getCepInformation";
import { Alert } from "react-native";

export default function AddressForm({
  handleBack,
  handleNext,
  activeStep,
  steps,
}) {
  const navigation = useNavigation();
  const { colors } = defaultConfig.theme.tokens;

  const {
    userInfo,
    setUserInfo,
    isDelivery,
    setIsDelivery,
    getClientByPhoneNumber,
  } = useShoppingCart();

  const { setIsLoading } = useLoader();
  const { addToast } = useToast();

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("O campo Nome é obrigatório"),
      phoneNumber: Yup.string().required("O campo Telefone é obrigatório"),
      cpf: Yup.string(),
      zipcode: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      neigborhood: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      isDelivery: Yup.string(),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      name: userInfo?.name ?? "",
      phoneNumber: userInfo?.phoneNumber ?? "",
      cpf: userInfo?.cpf ?? "",
      zipcode: userInfo?.zipcode ?? "",
      street: userInfo?.street ?? "",
      number: userInfo?.number ?? "",
      neigborhood: userInfo?.neigborhood ?? "",
      city: userInfo?.city ?? "",
      state: userInfo?.state ?? "",
      isDelivery: isDelivery ?? "Entrega",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    if (
      formValues.isDelivery === "Entrega" &&
      (isStringEmpty(formValues.zipcode) ||
        isStringEmpty(formValues.street) ||
        isStringEmpty(formValues.number) ||
        isStringEmpty(formValues.neigborhood) ||
        isStringEmpty(formValues.city) ||
        isStringEmpty(formValues.state))
    ) {
      Alert.alert(
        "Aviso!",
        "Opção entrega selecionada, precisa preencher com o endereço completo"
      );
      return;
    }

    try {
      const data = {
        ...userInfo,
        name: formValues.name,
        phoneNumber: formValues.phoneNumber,
        zipcode: formValues.zipcode,
        cpf: formValues.cpf,
        street: formValues.street,
        number: formValues.number,
        neigborhood: formValues.neigborhood,
        city: formValues.city,
        state: formValues.state,
        createdAt: new Date(Date.now()).getTime(),
        createdBy: "app",
        updatedAt: new Date(Date.now()).getTime(),
        updatedBy: "app",
      };

      setIsDelivery(formValues.isDelivery);

      setUserInfo(data);
      handleNext();
    } catch (error) {
      console.log("handleSubmit error", error);
    }
  };

  return (
    <VStack space="md">
      <Text fontSize={"$xl"}>Dados do usuário</Text>

      <VStack>
        <Text>Preferência</Text>
        <HStack space="sm">
          <Button
            borderColor="$red600"
            bg={
              formik.values.isDelivery === "Entrega"
                ? "$red600"
                : "$coolGray100"
            }
            variant={
              formik.values.isDelivery === "Entrega" ? "solid" : "outline"
            }
            onPress={() => formik.setFieldValue("isDelivery", "Entrega")}
          >
            <ButtonText
              color={
                formik.values.isDelivery === "Entrega"
                  ? "$coolGray100"
                  : "$red600"
              }
            >
              Entrega
            </ButtonText>
          </Button>
          <Button
            borderColor="$red600"
            bg={
              formik.values.isDelivery === "Retirada"
                ? "$red600"
                : "$coolGray100"
            }
            variant={
              formik.values.isDelivery === "Retirada" ? "solid" : "outline"
            }
            onPress={() => formik.setFieldValue("isDelivery", "Retirada")}
          >
            <ButtonText
              color={
                formik.values.isDelivery === "Retirada"
                  ? "$coolGray100"
                  : "$red600"
              }
            >
              Retirada
            </ButtonText>
          </Button>
        </HStack>
      </VStack>

      <VStack space="sm">
        <Text fontWeight="$semibold">Nome</Text>
        <Input
          isInvalid={!!formik.errors.name}
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
            value={formik.values.name}
            onChangeText={(text) => formik.setFieldValue("name", text)}
            placeholderTextColor={"#666"}
          />
        </Input>
        {!!formik.errors.name && (
          <Text fontSize={"$sm"} color="$red400">
            {formik.errors.name}
          </Text>
        )}
      </VStack>

      <VStack space="sm">
        <Text fontWeight="$semibold">Telefone</Text>
        <Input
          isInvalid={!!formik.errors.phoneNumber}
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
            keyboardType="number-pad"
            value={formik.values.phoneNumber}
            maxLength={15}
            onChangeText={(text) =>
              formik.setFieldValue("phoneNumber", celular(text))
            }
            onBlur={async () => {
              setIsLoading(true);
              const response = await getClientByPhoneNumber(
                formik.values.phoneNumber
              );

              if (response.length > 0) {
                addToast({
                  severity: "success",
                  message: "Cliente encontrado",
                });
                setUserInfo(response[0]);
                formik.setFieldValue("name", response[0].name ?? "");
                formik.setFieldValue("cpf", response[0].cpf ?? "");

                formik.setFieldValue("street", response[0].street ?? "");
                formik.setFieldValue("zipcode", response[0].zipcode ?? "");
                formik.setFieldValue("number", response[0].number ?? "");
                formik.setFieldValue(
                  "neigborhood",
                  response[0].neigborhood ?? ""
                );
                formik.setFieldValue("city", response[0].city ?? "");
                formik.setFieldValue("state", response[0].state ?? "");
                formik.setFieldValue("number", response[0].number ?? "");
              }
              setIsLoading(false);
            }}
            placeholderTextColor={"#666"}
          />
        </Input>
        {!!formik.errors.phoneNumber && (
          <Text fontSize={"$sm"} color="$red400">
            {formik.errors.phoneNumber}
          </Text>
        )}
      </VStack>

      <VStack space="sm">
        <Text fontWeight="$semibold">CPF</Text>
        <Input
          isInvalid={!!formik.errors.cpf}
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
            keyboardType="number-pad"
            value={formik.values.cpf}
            maxLength={14}
            onChangeText={(text) => formik.setFieldValue("cpf", cpf(text))}
            placeholderTextColor={"#666"}
          />
        </Input>
        {!!formik.errors.cpf && (
          <Text fontSize={"$sm"} color="$red400">
            {formik.errors.cpf}
          </Text>
        )}
      </VStack>

      {formik.values.isDelivery === "Entrega" && (
        <>
          <Divider />

          <Text fontSize={"$lg"}>Endereço para entrega</Text>

          <VStack space="sm">
            <Text fontWeight="$semibold">Cep</Text>
            <Input
              isInvalid={!!formik.errors.zipcode}
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
                keyboardType="number-pad"
                value={formik.values.zipcode}
                maxLength={9}
                onChangeText={(text) =>
                  formik.setFieldValue("zipcode", cep(text))
                }
                onBlur={async () => {
                  if (formik.values.zipcode.length === 9) {
                    try {
                      setIsLoading(true);
                      const resultCep = await getCepInformation(
                        formik.values.zipcode
                      );
                      if (resultCep.data.erro) {
                        addToast({
                          message: "CEP Não encontrado!",
                          severity: "warning",
                        });
                      } else {
                        if (resultCep.status === 200) {
                          formik.setFieldValue(
                            "neigborhood",
                            resultCep.data.bairro
                          );
                          formik.setFieldValue(
                            "street",
                            resultCep.data.logradouro
                          );
                          formik.setFieldValue(
                            "city",
                            resultCep.data.localidade
                          );
                          formik.setFieldValue("state", resultCep.data.uf);

                          addToast({
                            message: "CEP Encontrado!",
                            severity: "success",
                          });
                        } else {
                          addToast({
                            message: "Não foi possivel pesquisar o CEP!",
                            severity: "error",
                          });
                        }
                      }
                    } catch (error) {
                      console.log("locateCep error", error);
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }}
                placeholderTextColor={"#666"}
              />
            </Input>
            {!!formik.errors.zipcode && (
              <Text fontSize={"$sm"} color="$red400">
                {formik.errors.zipcode}
              </Text>
            )}
          </VStack>

          <VStack space="sm">
            <Text fontWeight="$semibold">Rua</Text>
            <Input
              isInvalid={!!formik.errors.street}
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
                value={formik.values.street}
                onChangeText={(text) => formik.setFieldValue("street", text)}
                placeholderTextColor={"#666"}
              />
            </Input>
            {!!formik.errors.street && (
              <Text fontSize={"$sm"} color="$red400">
                {formik.errors.street}
              </Text>
            )}
          </VStack>

          <VStack space="sm">
            <Text fontWeight="$semibold">Número</Text>
            <Input
              isInvalid={!!formik.errors.number}
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
                value={formik.values.number}
                onChangeText={(text) => formik.setFieldValue("number", text)}
                placeholderTextColor={"#666"}
              />
            </Input>
            {!!formik.errors.number && (
              <Text fontSize={"$sm"} color="$red400">
                {formik.errors.number}
              </Text>
            )}
          </VStack>

          <VStack space="sm">
            <Text fontWeight="$semibold">Bairro</Text>
            <Input
              isInvalid={!!formik.errors.neigborhood}
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
                value={formik.values.neigborhood}
                onChangeText={(text) =>
                  formik.setFieldValue("neigborhood", text)
                }
                placeholderTextColor={"#666"}
              />
            </Input>
            {!!formik.errors.neigborhood && (
              <Text fontSize={"$sm"} color="$red400">
                {formik.errors.neigborhood}
              </Text>
            )}
          </VStack>

          <VStack space="sm">
            <Text fontWeight="$semibold">Cidade</Text>
            <Input
              isInvalid={!!formik.errors.city}
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
                value={formik.values.city}
                onChangeText={(text) => formik.setFieldValue("city", text)}
                placeholderTextColor={"#666"}
              />
            </Input>
            {!!formik.errors.city && (
              <Text fontSize={"$sm"} color="$red400">
                {formik.errors.city}
              </Text>
            )}
          </VStack>

          <VStack space="sm">
            <Text fontWeight="$semibold">Estado</Text>
            <Input
              isInvalid={!!formik.errors.state}
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
                value={formik.values.state}
                onChangeText={(text) => formik.setFieldValue("state", text)}
                placeholderTextColor={"#666"}
              />
            </Input>
            {!!formik.errors.state && (
              <Text fontSize={"$sm"} color="$red400">
                {formik.errors.state}
              </Text>
            )}
          </VStack>
        </>
      )}

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
