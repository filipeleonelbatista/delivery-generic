import {
  FlatList,
  Image,
  Pressable,
  VStack,
  Text,
  Button,
  ButtonText,
  HStack,
} from "@gluestack-ui/themed";
import { useMemo } from "react";
import DeliveryStatusHeader from "../components/DeliveryStatusHeader";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useProducts } from "../hooks/useProducts";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { cutStringToMaxValue } from "../utils/string";

export default function Home() {
  const { productsList } = useProducts();
  const { addProductsToCart } = useShoppingCart();

  const currentProducts = useMemo(() => {
    let response = productsList.filter(
      (item) => item.active && item.isFeatured
    );

    if (response.length === 0) {
      response = productsList.filter((item) => item.active);
    }

    return response;
  }, [productsList]);

  return (
    <VStack bgColor={"$blueGray100"} flex={1}>
      <Header />
      <DeliveryStatusHeader />

      <FlatList
        data={currentProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HStack>
            <VStack w={"$56"}>
              <Pressable
                to={`/produto?id=${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <Text fontWeight="$bold" fontSize={"$xl"}>
                  {item.name}
                </Text>
              </Pressable>

              {item.previousValue ? (
                <VStack space={"sm"}>
                  <Text fontSize={"$sm"}>
                    {"De "}

                    {item?.previousValue?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                    })}

                    {" por"}
                  </Text>
                  <Text fontSize={"$lg"}>
                    {item?.currentValue?.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      useGrouping: true,
                    })}
                  </Text>
                </VStack>
              ) : (
                <Text fontSize={"$lg"}>
                  {item?.currentValue?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    useGrouping: true,
                  })}
                </Text>
              )}
              <Text fontSize={"$xl"}>
                {cutStringToMaxValue(item?.description)}
              </Text>
              <Button onPress={() => addProductsToCart(item, 1)}>
                <ButtonText>Comprar</ButtonText>
              </Button>
            </VStack>
            <Image w={100} h={100} source={{ uri: item?.featuredImage }} />
          </HStack>
        )}
      />
      <Footer />
    </VStack>
  );
}
