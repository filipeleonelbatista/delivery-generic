import {
  Button,
  ButtonIcon,
  HStack,
  Image,
  MenuIcon,
  Text,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useConfig } from "../hooks/useConfig";

export default function Header() {
  const navigation = useNavigation();
  const { config } = useConfig();

  return (
    <HStack alignItems="center" justifyContent="space-between" px={16}>
      {config.useLogoInHeader ? (
        <Image w={130} height={70} source={{ uri: config.logo }} />
      ) : (
        <Text fontWeight="$bold" fontSize="$xl">
          {config.name}
        </Text>
      )}

      <Button
        onPress={() => navigation.openDrawer()}
        borderRadius="$full"
        w={64}
        h={64}
        p="$3.5"
        bg="$blueGray100"
      >
        <ButtonIcon as={MenuIcon} color="$red600" size="2xl" />
      </Button>
    </HStack>
  );
}
