import Feather from "@expo/vector-icons/Feather";
import {
  Button,
  ButtonIcon,
  ButtonText,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useProducts } from "../hooks/useProducts";

export default function Item() {
  const navigation = useNavigation();
  const params = useRoute().params;

  const { width } = useWindowDimensions();
  const { productsList } = useProducts();

  const product = useMemo(() => {
    if (params.productId) {
      return productsList.filter((item) => item.id === params.productId)[0];
    } else {
      return null;
    }
  }, [params.productId, productsList]);

  return (
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
          </VStack>
          <VStack h="$10" />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
