import {
  Button,
  ButtonText,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { cutStringToMaxValue } from "../utils/string";

export default function ProductItem({ product }) {
  const navigation = useNavigation();
  const { addProductsToCart } = useShoppingCart();
  return (
    <HStack bgColor="$white" justifyContent="space-between" borderRadius="$md">
      <VStack w={"$56"} p={14}>
        <Heading
          onPress={() =>
            navigation.navigate("Item", { productId: product.id })
          }
          numberOfLines={1}
          w={"$full"}
          fontSize={"$xl"}
        >
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
          {cutStringToMaxValue(product?.description)}
        </Text>
        <Button
          sx={{
            width: "$32",
            bgColor: "$white",
            ":active": {
              bgColor: "$red200",
            },
          }}
          onPress={() => addProductsToCart(product, 1)}
        >
          <ButtonText color="$red600">Comprar</ButtonText>
        </Button>
      </VStack>
      <Pressable
        borderTopRightRadius={"$md"}
        borderBottomRightRadius={"$md"}
        w={130}
        h={"$full"}
        maxHeight={190}
        onPress={() => navigation.navigate("Item", { productId: product.id })}
      >
        <Image
          borderTopRightRadius={"$md"}
          borderBottomRightRadius={"$md"}
          w={130}
          maxHeight={190}
          h={"$full"}
          source={{ uri: product?.featuredImage }}
        />
      </Pressable>
    </HStack>
  );
}
