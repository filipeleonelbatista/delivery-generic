import { Text, VStack } from "@gluestack-ui/themed";
import { useConfig } from "../hooks/useConfig";
import { useMemo } from "react";

export default function DeliveryStatusHeader() {
  const { config } = useConfig();

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
    <VStack w="$full" h="$6" bgColor={"$red600"} alignItems="center">
      <Text fontSize={"$sm"} color="$white">
        {status}
      </Text>
    </VStack>
  );
}
