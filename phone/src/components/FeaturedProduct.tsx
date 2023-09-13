import {
  Button,
  ButtonText,
  Heading,
  Image,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { cutStringToMaxValue } from "../utils/string";

export default function FeaturedProduct({ product }) {
  const navigation = useNavigation();
  const { addProductsToCart } = useShoppingCart();

  return (
    <VStack
      bgColor="$white"
      p={16}
      borderRadius="$md"
      w={220}
      h={335}
      position="relative"
    >
      <Pressable
        borderRadius={"$sm"}
        w={185}
        h={140}
        onPress={() => navigation.navigate("Item", { productId: product.id })}
      >
        <Image
          borderRadius={"$sm"}
          w={185}
          h={140}
          source={{ uri: product?.featuredImage }}
        />
      </Pressable>

      <VStack w={"$full"} space="$sm">
        <Heading
          onPress={() => navigation.navigate("Item", { productId: product.id })}
          maxWidth={185}
          numberOfLines={1}
          fontSize={"$md"}
        >
          {product.name}
        </Heading>

        {product.previousValue ? (
          <VStack space={"$xs"}>
            <Text maxWidth={185} fontSize={"$sm"}>
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
            <Text maxWidth={185} color="$red600" fontSize={"$md"}>
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
          <Text maxWidth={185} color="$red600" fontSize={"$md"}>
            {product?.currentValue?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              useGrouping: true,
            })}
          </Text>
        )}
        <Text maxWidth={185} numberOfLines={2} fontSize={"$sm"} my={4}>
          {cutStringToMaxValue(product?.description)}
        </Text>
      </VStack>

      <Button
        sx={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 10,
          bgColor: "$white",
          ":active": {
            bgColor: "$red185",
          },
        }}
        onPress={() => addProductsToCart(product, 1)}
      >
        <ButtonText color="$red600">Comprar</ButtonText>
      </Button>
    </VStack>
  );
}
