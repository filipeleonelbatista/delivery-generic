import {
  Button,
  ButtonIcon,
  ButtonText,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";

export default function Checkout() {
  const navigation = useNavigation();
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
          <Text>Checkout</Text>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
