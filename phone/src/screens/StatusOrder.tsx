import { Feather } from "@expo/vector-icons";
import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  config as defaultConfig,
  Divider,
  Heading,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Text,
  Textarea,
  TextareaInput,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function StatusOrder() {
  const navigation = useNavigation();
  const params = useRoute().params;

  console.log("params", params)

  return (
    <VStack bgColor={"$coolGray100"} flex={1}>
      <VStack
        py={8}
        bgColor="$coolGray100"
        borderBottomWidth={1}
        borderBottomColor="$coolGray300"
      >
        <Button
          w={"$48"}
          bgColor="$coolGray100"
          alignItems="center"
          justifyContent="flex-start"
          onPress={() => navigation.navigate("Home")}
        >
          <ButtonIcon color={"$coolGray900"} mr={8}>
            <Feather name="chevron-left" size={18} />
          </ButtonIcon>
          <ButtonText color={"$coolGray900"} mr={16}>
            Status do pedido
          </ButtonText>
        </Button>
      </VStack>
      <ScrollView>
        <VStack
          width={"$full"}
          alignItems="center"
          paddingVertical={16}
          h={"$full"}
          space="lg"
        ></VStack>
      </ScrollView>
    </VStack>
  );
}
