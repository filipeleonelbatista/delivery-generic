import Feather from "@expo/vector-icons/Feather";
import {
  Button,
  ButtonIcon,
  ButtonText,
  ChevronRightIcon,
  Divider,
  Heading,
  HStack,
  Image,
  Input,
  InputField,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import ShoppingCartComponentOverlay from "../components/ShoppingCartComponentOverlay";
import { useProducts } from "../hooks/useProducts";
import { useShoppingCart } from "../hooks/useShoppingCart";

import * as Yup from "yup";
import { useFormik } from "formik";
import { FlatList } from "react-native-gesture-handler";
import FeaturedProduct from "../components/FeaturedProduct";

export default function Item() {
  const navigation = useNavigation();
  const params = useRoute().params;

  const { width } = useWindowDimensions();
  const { productsList } = useProducts();
  const { addProductsToCart } = useShoppingCart();

  const product = useMemo(() => {
    if (params.productId) {
      return productsList.filter((item) => item.id === params.productId)[0];
    } else {
      return null;
    }
  }, [params.productId, productsList]);

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      quantity: Yup.string().required("O campo Nome é obrigatório"),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      quantity: "1",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmitForm(values);
    },
  });

  const handleSubmitForm = async (formValues) => {
    addProductsToCart(product, Number(formValues.quantity));
  };

  const currentProducts = useMemo(() => {
    let response = productsList.filter(
      (item) => item.active && product.categoryId === item.categoryId
    );

    return response;
  }, [productsList, product]);

  return (
    <ShoppingCartComponentOverlay>
      <VStack bgColor={"$coolGray100"} flex={1}>
        <VStack
          py={8}
          bgColor="$coolGray100"
          borderBottomWidth={1}
          borderBottomColor="$coolGray300"
        >
          <Button
            w={"$32"}
            bgColor="$coolGray100"
            alignItems="center"
            justifyContent="flex-start"
            onPress={() => navigation.navigate("Home")}
          >
            <ButtonIcon color={"$coolGray900"} mr={8}>
              <Feather name="chevron-left" size={18} />
            </ButtonIcon>
            <ButtonText color={"$coolGray900"} mr={16}>
              Voltar
            </ButtonText>
          </Button>
        </VStack>
        <ScrollView>
          <VStack width={"$full"} h={"$full"}>
            <Image
              w={width}
              h={width * 0.8}
              source={{ uri: product.featuredImage }}
            />

            <VStack p={16}>
              <Heading numberOfLines={1} w={"$full"} fontSize={"$xl"}>
                {product?.name}
              </Heading>

              {product?.previousValue ? (
                <VStack>
                  <Text fontSize={"$sm"}>
                    {"De "}

                    <Text strikeThrough>
                      {product?.previousValue?.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        useGrouping: true,
                      })}
                    </Text>

                    {" por"}
                  </Text>
                  <Text fontSize={"$md"} color="$red600">
                    {product?.currentValue?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                    })}
                  </Text>
                </VStack>
              ) : (
                <Text fontSize={"$md"} color="$red600">
                  {product?.currentValue?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                  })}
                </Text>
              )}
              <Text fontSize={"$sm"} my={4}>
                {product?.description}
              </Text>

              <HStack space={"md"}>
                <Pressable
                  onPress={() => {
                    formik.setFieldValue(
                      "quantity",
                      Number(formik.values.quantity) === 1
                        ? "1"
                        : `${Number(formik.values.quantity) - 1}`
                    );
                  }}
                  borderRadius="$full"
                  w={40}
                  h={40}
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

                <Input
                  sx={{ width: 50 }}
                  variant="outline"
                  size="md"
                  isDisabled={false}
                >
                  <InputField
                    value={formik.values.quantity}
                    placeholderTextColor={"#666"}
                    textAlign="center"
                  />
                </Input>

                <Pressable
                  onPress={() => {
                    formik.setFieldValue(
                      "quantity",
                      `${Number(formik.values.quantity) + 1}`
                    );
                  }}
                  borderRadius="$full"
                  w={40}
                  h={40}
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
              </HStack>

              <Button
                onPress={formik.handleSubmit}
                bg="$red600"
                borderRadius={"$full"}
                sx={{
                  my: 16,
                  ":active": {
                    bgColor: "$red800",
                  },
                }}
              >
                <ButtonText>Comprar</ButtonText>
              </Button>
            </VStack>
            <VStack p={"$4"}>
              <HStack justifyContent="space-between">
                <Heading>Produtos relacionados</Heading>
                <Button
                  bgColor={"$coolGray100"}
                  alignItems="center"
                  sx={{
                    ":active": {
                      bgColor: "$red200",
                    },
                  }}
                  onPress={() => navigation.navigate("Products")}
                >
                  <ButtonText color="$red600" fontWeight="$normal">
                    Ver mais
                  </ButtonText>
                </Button>
              </HStack>
              <Divider my={4} />
            </VStack>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={currentProducts}
              contentContainerStyle={{
                height: 345,
                paddingHorizontal: 16,
                paddingVertical: 4,
              }}
              ItemSeparatorComponent={() => <VStack w={16} />}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <>
                  <FeaturedProduct product={item} />
                  {currentProducts.length === index + 1 && (
                    <VStack
                      space={"md"}
                      alignItems="center"
                      justifyContent="center"
                      h={335}
                      mx={"$10"}
                    >
                      <Button
                        onPress={() => navigation.navigate("Products")}
                        borderRadius="$full"
                        w={64}
                        h={64}
                        p="$3.5"
                        bg="$red600"
                      >
                        <ButtonIcon
                          as={ChevronRightIcon}
                          color="$white"
                          size="2xl"
                        />
                      </Button>
                      <Text fontSize={"$md"}>Ver mais</Text>
                    </VStack>
                  )}
                </>
              )}
            />
            <VStack h="$10" />
          </VStack>
        </ScrollView>
      </VStack>
    </ShoppingCartComponentOverlay>
  );
}
