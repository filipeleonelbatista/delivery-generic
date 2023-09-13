import {
  Avatar,
  Button,
  ButtonIcon,
  ButtonText,
  ChevronRightIcon,
  CloseIcon,
  Heading,
  HStack,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";

export default function CustomDrawer(props) {
  return (
    <VStack flex={1} bgColor="$coolGray100">
      <HStack bgColor={"$red600"} p={16} space={"4xl"}>
        <HStack space="md">
          <Avatar bgColor="$coolGray500">
            {/* <Icon as={User} color="white" size="lg" /> */}
          </Avatar>
          <VStack>
            <Heading color="white" size="sm">
              Ronald Richards
            </Heading>
            <Text color="white" size="sm">
              Seja bem vindo 👋
            </Text>
          </VStack>
        </HStack>
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
            <ButtonText color="$coolGray800">Cadastrar</ButtonText>
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
            <ButtonText color="$coolGray800">Entrar</ButtonText>
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
      </ScrollView>
    </VStack>
  );
}
