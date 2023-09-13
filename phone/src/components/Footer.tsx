import { Text, VStack } from "@gluestack-ui/themed";
import { useConfig } from "../hooks/useConfig";

export default function Footer() {
  const { config } = useConfig();
  return (
    <VStack>
      <VStack alignItems="center" my={16}>
        <Text color="$red700" fontSize={"$sm"}>
          {config.name}
        </Text>
        <Text fontSize={"$xs"}>Ver 1.0.0</Text>
      </VStack>
    </VStack>
  );
}
