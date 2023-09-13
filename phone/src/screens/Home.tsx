import {
  Button,
  ButtonIcon,
  ButtonText,
  ChevronRightIcon,
  Divider,
  FlatList,
  Heading,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import DeliveryStatusHeader from "../components/DeliveryStatusHeader";
import FeaturedProduct from "../components/FeaturedProduct";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ShoppingCartComponentOverlay from "../components/ShoppingCartComponentOverlay";
import { useBanners } from "../hooks/useBanners";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const { width } = useWindowDimensions();
  const { productsList } = useProducts();
  const { categoriesList } = useCategories();
  const { bannersList } = useBanners();
  const navigation = useNavigation();

  const currentBanners = useMemo(() => {
    return bannersList.filter((item) => item.active);
  }, [bannersList]);

  const currentCategories = useMemo(() => {
    return categoriesList.filter((item) => item.active);
  }, [categoriesList]);

  const currentProducts = useMemo(() => {
    let response = productsList.filter(
      (item) => item.active && item.isFeatured
    );

    if (response.length === 0) {
      response = productsList.filter((item) => item.active);
    }

    return response;
  }, [productsList]);

  return (
    <ShoppingCartComponentOverlay>
      <VStack bgColor={"$coolGray100"} flex={1}>
        <Header />
        <DeliveryStatusHeader />
        <ScrollView>
          <VStack width={"$full"} h={"$full"}>
            <FlatList
              horizontal
              pagingEnabled
              data={currentBanners}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                height: 150,
              }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {}}
                  w={width}
                  h={150}
                  alignItems="center"
                >
                  <VStack position="relative">
                    <Image w={width} h={150} source={{ uri: item.image }} />
                    <VStack
                      w={width}
                      h={150}
                      bgColor="$black"
                      opacity={0.3}
                      position="absolute"
                      top={0}
                      zIndex={10}
                    />
                    <VStack
                      w={width}
                      h={150}
                      position="absolute"
                      top={0}
                      zIndex={10}
                      p={"$5"}
                      space={"md"}
                    >
                      <Heading
                        color="$white"
                        maxWidth={width * 0.8}
                        numberOfLines={2}
                        fontSize="$2xl"
                      >
                        {item.title}
                      </Heading>
                      <Text
                        color="$white"
                        maxWidth={width * 0.8}
                        numberOfLines={3}
                        fontSize="$lg"
                      >
                        {item.subtitle}
                      </Text>
                    </VStack>
                  </VStack>
                </Pressable>
              )}
            />

            <VStack p={"$4"}>
              <HStack>
                <Heading>Categorias</Heading>
              </HStack>
              <Divider my={4} />
            </VStack>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={currentCategories}
              contentContainerStyle={{
                paddingHorizontal: 16,
                height: 95,
              }}
              ItemSeparatorComponent={() => <VStack w={16} />}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate("Products", {
                      categoryId: item.id,
                    })
                  }
                  h={95}
                  alignItems="center"
                >
                  <Image
                    w={64}
                    h={64}
                    borderRadius="$full"
                    source={{ uri: item.avatar }}
                  />
                  <Text numberOfLines={1} maxWidth={80} fontSize={"$sm"} mt={1}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
            />

            <VStack p={"$4"}>
              <HStack justifyContent="space-between">
                <Heading>Destaques</Heading>
                <Button
                  bgColor={"$coolGray100"}
                  alignItems="center"
                  sx={{
                    ":active": {
                      bgColor: "$red200",
                    },
                  }}
                  onPress={() => navigation.navigate("Products")}
                >
                  <ButtonText color="$red600" fontWeight="$normal">
                    Ver mais
                  </ButtonText>
                </Button>
              </HStack>
              <Divider my={4} />
            </VStack>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={currentProducts}
              contentContainerStyle={{
                height: 345,
                paddingHorizontal: 16,
                paddingVertical: 4,
              }}
              ItemSeparatorComponent={() => <VStack w={16} />}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <>
                  <FeaturedProduct product={item} />
                  {currentProducts.length === index + 1 && (
                    <VStack
                      space={"md"}
                      alignItems="center"
                      justifyContent="center"
                      h={335}
                      mx={"$10"}
                    >
                      <Button
                        onPress={() => navigation.navigate("Products")}
                        borderRadius="$full"
                        w={64}
                        h={64}
                        p="$3.5"
                        bg="$red600"
                      >
                        <ButtonIcon
                          as={ChevronRightIcon}
                          color="$white"
                          size="2xl"
                        />
                      </Button>
                      <Text fontSize={"$md"}>Ver mais</Text>
                    </VStack>
                  )}
                </>
              )}
            />
            <Footer />
          </VStack>
        </ScrollView>
      </VStack>
    </ShoppingCartComponentOverlay>
  );
}
