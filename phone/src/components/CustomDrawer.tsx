import { Feather } from "@expo/vector-icons";
import {
  Avatar,
  Button,
  ButtonIcon,
  ButtonText,
  ChevronRightIcon,
  CloseIcon,
  Heading,
  HStack,
  Icon,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { config as defaultConfig } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../hooks/useUser";
import NoData from "./NoData";

export default function CustomDrawer(props) {
  const navigation = useNavigation();

  const { user, orderList } = useUser();

  const { colors } = defaultConfig.theme.tokens;

  const isLogged = false;
  return (
    <VStack flex={1} bgColor="$coolGray100">
      <HStack bgColor={"$red600"} p={16} alignItems="center" space={"4xl"}>
        {user ? (
          <>
            <HStack space="md">
              <Avatar bgColor="$white">
                <Feather name="user" color={colors.red600} size={28} />
              </Avatar>
              <VStack>
                <Heading color="white" size="sm">
                  {user?.name}
                </Heading>
                <Text color="white" size="sm">
                  Seja bem vindo 👋
                </Text>
              </VStack>
            </HStack>
          </>
        ) : (
          <>
            <Heading color="white" size="sm" sx={{ width: "70%" }}>
              Seja bem vindo 👋
            </Heading>
          </>
        )}
        <Button
          onPress={() => props.navigation.closeDrawer()}
          borderRadius="$full"
          size="lg"
          p={0}
          w={48}
          h={48}
          mr="auto"
          bg="$red600"
        >
          <ButtonIcon as={CloseIcon} color="$white" size="lg" />
        </Button>
      </HStack>
      <ScrollView>
        {user ? (
          <VStack space="sm" py={16}>
            <Button
              sx={{
                bgColor: "$coolGray100",
                justifyContent: "space-between",
                ":active": {
                  bgColor: "$red100",
                },
              }}
            >
              <ButtonText color="$coolGray800">Meus Pedidos</ButtonText>
              <ButtonIcon as={ChevronRightIcon} color="$coolGray800" />
            </Button>

            <Button
              sx={{
                bgColor: "$coolGray100",
                justifyContent: "space-between",
                ":active": {
                  bgColor: "$red100",
                },
              }}
            >
              <ButtonText color="$coolGray800">Meu carrinho</ButtonText>
              <ButtonIcon as={ChevronRightIcon} color="$coolGray800" />
            </Button>

            <Button
              sx={{
                bgColor: "$coolGray100",
                justifyContent: "space-between",
                ":active": {
                  bgColor: "$red100",
                },
              }}
            >
              <ButtonText color="$coolGray800">Sair</ButtonText>
              <ButtonIcon as={ChevronRightIcon} color="$coolGray800" />
            </Button>
          </VStack>
        ) : (
          <VStack space="sm" py={16}>
            <NoData
              primaryColor={colors.red600}
              description={
                <VStack sx={{ maxWidth: "90%", marginTop: 20 }}>
                  <Text textAlign="center" fontSize={"$sm"}>
                    Entre com seu numero de celular ou crie seu primeiro pedido
                    para acompanhar e ter acesso a ofertas exclusivas no App!
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
                    <ButtonText>Entrar</ButtonText>
                  </Button>
                </VStack>
              }
              style={{
                width: 180,
                height: 180,
              }}
            />
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
}
