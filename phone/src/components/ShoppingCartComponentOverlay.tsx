import {
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useShoppingCart } from "../hooks/useShoppingCart";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Heading,
  ScrollView,
} from "@gluestack-ui/themed";
import ItemCart from "./ItemCart";
import { formatCurrency } from "../utils/formatCurrency";

export default function ShoppingCartComponentOverlay(props) {
  const navigation = useNavigation();
  const {
    productsList,
    handleRemoveProductFromCart,
    updateQuantity,
    totalShoppingCart,
  } = useShoppingCart();

  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);

  return (
    <VStack flex={1} position="relative">
      {props.children}

      {productsList.length > 0 && (
        <Button
          onPress={() => {}}
          borderRadius="$full"
          w={64}
          h={64}
          p="$3.5"
          bg="$red600"
          sx={{
            position: "absolute",
            bottom: 24,
            right: 24,
            ":active": {
              bgColor: "$red800",
            },
          }}
        >
          <ButtonIcon
            w={22}
            h={22}
            alignItems="center"
            justifyContent="center"
            onPress={() => setShowActionsheet(true)}
          >
            <FontAwesome name="shopping-bag" size={20} color="white" />
          </ButtonIcon>
        </Button>
      )}
      <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
        <ActionsheetBackdrop />
        <ActionsheetContent bgColor="$coolGray100" zIndex={999}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack w={"$full"} alignItems="center">
            <ScrollView height={380} showsVerticalScrollIndicator={false}>
              <VStack w={"$full"} alignItems="center">
                <Heading fontSize={"$2xl"} my={"$4"}>
                  Seu Pedido
                </Heading>
              </VStack>
              {productsList.map((item, index) => (
                <VStack key={index} my="$1">
                  <ItemCart
                    product={item}
                    index={index}
                    handleRemoveProductFromCart={handleRemoveProductFromCart}
                    updateQuantity={updateQuantity}
                  />
                </VStack>
              ))}
              {productsList.length > 0 && (
                <>
                  <HStack justifyContent="space-between" my="$2">
                    <Heading>Subtotal:</Heading>
                    <Heading> {formatCurrency(totalShoppingCart)}</Heading>
                  </HStack>
                  <Button
                    onPress={() => {
                      navigation.navigate("Checkout")
                      handleClose();
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
                    <ButtonText>Finalizar o pedido</ButtonText>
                  </Button>
                </>
              )}
              <VStack h="$2" />
            </ScrollView>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
}
