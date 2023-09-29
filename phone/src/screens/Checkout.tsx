import Feather from "@expo/vector-icons/Feather";
import {
  Button,
  ButtonIcon,
  ButtonText,
  Heading,
  HStack,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AddressForm from "../components/AddressForm";
import Items from "../components/Items";
import PaymentForm from "../components/PaymentForm";
import Review from "../components/Review";

export default function Checkout() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const steps = [
    "Seu pedido",
    "Endereço para entrega",
    "Método de pagamento",
    "Revise seu pedido",
  ];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Items
            handleBack={handleBack}
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
          />
        );
      case 1:
        return (
          <AddressForm
            handleBack={handleBack}
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
          />
        );
      case 2:
        return (
          <PaymentForm
            handleBack={handleBack}
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
          />
        );
      case 3:
        return (
          <Review
            handleBack={handleBack}
            handleNext={handleNext}
            activeStep={activeStep}
            steps={steps}
          />
        );
      default:
        throw new Error("Passo desconhecido");
    }
  }

  useEffect(() => {
    if (isFocused) {
      setActiveStep(0);
    }
  }, [isFocused]);

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
        <VStack
          width={"$full"}
          alignItems="center"
          paddingVertical={16}
          h={"$full"}
          space="lg"
        >
          <Heading>Seu pedido</Heading>

          <HStack
            w={"100%"}
            paddingHorizontal={16}
            justifyContent="space-between"
          >
            {steps.map((label, index) => (
              <VStack key={index} alignItems="center" space="xs">
                <Text
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 18,
                    bgColor: activeStep >= index ? "$red600" : "$coolGray400",
                    color: "$white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontSize: 12,
                  }}
                >
                  {index + 1}
                </Text>
                <Text
                  fontSize={"$xs"}
                  maxWidth={"$20"}
                  textAlign="center"
                  lineHeight={14}
                >
                  {label}
                </Text>
              </VStack>
            ))}
            {/* <Divider /> */}
          </HStack>

          <VStack w={"100%"} paddingHorizontal={16}>
            {getStepContent(activeStep)}
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
