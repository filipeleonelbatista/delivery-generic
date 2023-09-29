import {
  Button,
  ButtonText,
  config as defaultConfig,
  Heading,
  HStack,
  Image,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { formatCurrency } from "../utils/formatCurrency";
import NoData from "./NoData";
import Feather from "@expo/vector-icons/Feather";

export default function Items({ handleBack, handleNext, activeStep, steps }) {
  const navigation = useNavigation();
  const { colors } = defaultConfig.theme.tokens;

  const {
    productsList,
    totalShoppingCart,
    handleRemoveProductFromCart,
    updateQuantity,
  } = useShoppingCart();

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
          <Text fontSize={"$md"}>Total</Text>
          <Text fontSize={"$md"} fontWeight="$bold">
            {formatCurrency(totalShoppingCart)}
          </Text>
        </HStack>
      )}

      {productsList.length > 0 && (
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
            onPress={handleNext}
          >
            <ButtonText>
              {activeStep === steps.length - 1 ? "Enviar pedido" : "Próximo"}
            </ButtonText>
          </Button>
        </HStack>
      )}
    </VStack>
  );
}
