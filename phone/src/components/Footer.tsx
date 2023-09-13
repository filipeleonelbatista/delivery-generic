import {
  Button,
  ButtonIcon,
  ButtonText,
  Heading,
  HStack,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useConfig } from "../hooks/useConfig";
import { FontAwesome } from "@expo/vector-icons";
import { config as defaultConfig } from "@gluestack-ui/themed";
import { useMemo } from "react";

export default function Footer() {
  const { config } = useConfig();
  const { colors } = defaultConfig.theme.tokens;

  const status = useMemo(() => {
    if (config.isDeliveryOpen) {
      return "Delivery está aberto";
    } else if (config.isStoreOpen) {
      return "Apenas retirada";
    } else {
      return "Estamos fechados";
    }
  }, [config]);

  return (
    <VStack>
      <VStack alignItems="center" my={16} space={"xs"}>
        <Heading color="$black" fontSize={"$lg"}>
          {config.name}
        </Heading>
        <HStack>
          <Button
            bgColor={"$coolGray100"}
            w={48}
            h={48}
            borderRadius={"$full"}
            alignItems="center"
            sx={{
              ":active": {
                bgColor: "$red200",
              },
            }}
          >
            <ButtonText w={20} alignItems={"center"}>
              <FontAwesome
                name="facebook-official"
                size={24}
                color={colors["red600"]}
              />
            </ButtonText>
          </Button>
          <Button
            bgColor={"$coolGray100"}
            w={48}
            h={48}
            borderRadius={"$full"}
            alignItems="center"
            sx={{
              ":active": {
                bgColor: "$red200",
              },
            }}
          >
            <ButtonText w={20} alignItems={"center"}>
              <FontAwesome name="whatsapp" size={24} color={colors["red600"]} />
            </ButtonText>
          </Button>
          <Button
            bgColor={"$coolGray100"}
            w={48}
            h={48}
            borderRadius={"$full"}
            alignItems="center"
            sx={{
              ":active": {
                bgColor: "$red200",
              },
            }}
          >
            <ButtonText w={20} alignItems={"center"}>
              <FontAwesome
                name="instagram"
                size={24}
                color={colors["red600"]}
              />
            </ButtonText>
          </Button>
        </HStack>
        <HStack alignItems="center" space="sm">
          <VStack
            w={"$3"}
            h={"$3"}
            borderRadius="$full"
            bgColor={
              config?.isDeliveryOpen || config?.isStoreOpen
                ? "$red600"
                : "$white"
            }
            borderWidth={"$1"}
            borderColor={"$red600"}
          />
          <Text>{status}</Text>
        </HStack>

        <Button
          bgColor={"$coolGray100"}
          sx={{
            ":active": {
              bgColor: "$red200",
            },
          }}
        >
          <ButtonIcon w={28} size={"xl"}>
            <FontAwesome name="map-o" size={24} color={colors["red600"]} />
          </ButtonIcon>
          <ButtonText color={"$red600"}>{" Rotas"}</ButtonText>
        </Button>
        <Text color="$red700" fontSize={"$sm"}>
          Desenvolvedor de aplicativos {new Date().getFullYear()}
        </Text>
        <Text fontSize={"$xs"}>Ver 1.0.0</Text>
      </VStack>
    </VStack>
  );
}
