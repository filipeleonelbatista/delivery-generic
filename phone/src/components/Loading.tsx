import { Image, Spinner, VStack } from "@gluestack-ui/themed";

import logo from "../assets/icon.png";

export default function Loading() {
  return (
    <VStack flex={1} alignItems="center" justifyContent="center" bg={"#f20530"}>
      <Image
        alt="logo"
        source={logo}
        size={"md"}
        borderRadius={"$full"}
        mb={16}
      />
      <Spinner size={"large"} color={"#FFF"} />
    </VStack>
  );
}
