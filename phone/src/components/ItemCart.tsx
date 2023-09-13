import {
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { cutStringToMaxValue } from "../utils/string";

import Feather from "@expo/vector-icons/Feather";

export default function ItemCart({
  product,
  index,
  handleRemoveProductFromCart,
  updateQuantity,
}) {
  return (
    <HStack
      bgColor="$white"
      justifyContent="space-between"
      borderRadius="$md"
      position="relative"
    >
      <Pressable
        onPress={() => handleRemoveProductFromCart(index)}
        borderRadius="$full"
        w={40}
        h={40}
        bg="$red600"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
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
      <VStack w={"$56"} p={14}>
        <Heading numberOfLines={1} w={"$full"} fontSize={"$xl"}>
          {product?.productObject.name}
        </Heading>

        <Text fontSize={"$md"} color="$coolGray700">
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
        <Text fontSize={"$sm"} my={4}>
          {cutStringToMaxValue(product?.productObject?.description)}
        </Text>
        <HStack space={"md"}>
          <Pressable
            onPress={() => updateQuantity(index, "adicionar")}
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
          <Pressable
            onPress={() => updateQuantity(index, "remover")}
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
        </HStack>
      </VStack>
      <Image
        borderTopRightRadius={"$md"}
        borderBottomRightRadius={"$md"}
        w={130}
        maxHeight={190}
        h={"$full"}
        source={{ uri: product?.productObject?.featuredImage }}
      />
    </HStack>
  );
}
