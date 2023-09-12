import { Feather } from "@expo/vector-icons";
import { useTheme } from "@gluestack-style/react";
import {
  Button,
  ButtonIcon,
  ButtonText,
  FlatList,
  Image,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import Loading from "../components/Loading";

export default function Onboarding() {
  const theme = useTheme();

  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [isOnboardingPassed, setIsOnboardingPassed] = useState("waiting");

  const slides = [
    {
      id: "1",
      image: require("../assets/onboarding/1.png"),
      title: "Compre conosco",
      subtitle: "Compre com a gente pelo app.",
      show: false,
    },
    {
      id: "2",
      image: require("../assets/onboarding/1.png"),
      title: "Controle suas compras",
      subtitle: "Compre seus pedidos.",
      show: true,
    },
  ];

  async function handleLeaveOnboarding() {
    try {
      await AsyncStorage.setItem("@onboarding", "true");
      setIsOnboardingPassed("passed");
      navigation.navigate("Login");
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (isFocused) {
      const executeAsync = async () => {
        try {
          const value = await AsyncStorage.getItem("@onboarding");
          if (value !== null) {
            if (JSON.parse(value)) {
              setIsOnboardingPassed("passed");
              navigation.navigate("Login");
            }
          } else {
            setIsOnboardingPassed("no-passed");
          }
        } catch (e) {
          console.error(e);
        }
      };
      executeAsync();
    }
  }, [isFocused]);

  if (isOnboardingPassed === "waiting") {
    return <Loading />;
  }

  return (
    <FlatList
      pagingEnabled
      horizontal
      data={slides}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <VStack
          key={item.id}
          bg={"$red600"}
          width={width}
          height={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          paddingHorizontal={4}
          space={"md"}
        >
          <Image
            alt={item.title}
            source={item.image}
            size={"2xl"}
            borderRadius={2}
          />
          <Text fontSize={18} color={"#F0F2F5"} textAlign={"center"}>
            {item.title}
          </Text>
          <Text fontSize={14} color={"#F0F2F5"} textAlign={"center"}>
            {item.subtitle}
          </Text>

          {item.show && (
            <Button
              onPress={handleLeaveOnboarding}
              borderRadius={"$full"}
              sx={{
                w: "70%",
                bgColor: "$red800",
                ":active": {
                  bg: "$red900",
                },
                ":hover": {
                  bg: "$red900",
                },
              }}
            >
              <ButtonText>Vamos comecar?!</ButtonText>
            </Button>
          )}
        </VStack>
      )}
    />
  );
}
