import { Image, Input, InputField, Text, VStack } from "@gluestack-ui/themed";
import { useWindowDimensions } from "react-native";

export default function Login() {
  const { width, height } = useWindowDimensions();
  return (
    <VStack flex={1} position="relative">
      <Image
        flex={1}
        sx={{
          width,
          height,
        }}
        source={{ uri: "https://source.unsplash.com/random?food" }}
        position="absolute"
        top={0}
        left={0}
      />
      <VStack
        flex={1}
        bgColor="$black"
        opacity={0.3}
        position="absolute"
        sx={{
          width,
          height,
        }}
        top={0}
        left={0}
        zIndex={100}
        display="flex"
        alignItems="center"
        justifyContent="center"
      />

      <VStack
        flex={1}
        sx={{
          width,
          height,
        }}
        position="absolute"
        top={0}
        left={0}
        zIndex={100}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack
          bgColor="$white"
          sx={{
            width: width * 0.8,
            padding: 16,
            borderRadius: 4,
          }}
        >
          <Text>Digite seu telefone para continuar</Text>
          <Input variant="outline" size="md">
            <InputField placeholder="Digite seu telefone" />
          </Input>
        </VStack>
      </VStack>
    </VStack>
  );
}
