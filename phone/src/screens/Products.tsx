import Feather from "@expo/vector-icons/Feather";
import {
  Button,
  ButtonIcon,
  ButtonText,
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import ProductItem from "../components/ProductItem";
import ShoppingCartComponentOverlay from "../components/ShoppingCartComponentOverlay";
import { useBanners } from "../hooks/useBanners";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

export default function Products() {
  const navigation = useNavigation();
  const params = useRoute().params;

  const { width } = useWindowDimensions();
  const { productsList } = useProducts();
  const { categoriesList } = useCategories();
  const { bannersList } = useBanners();

  const currentBanners = useMemo(() => {
    return bannersList.filter((item) => item.active);
  }, [bannersList]);

  const category = useMemo(() => {
    if (params?.categoryId) {
      return categoriesList.filter((item) => item.id === params.categoryId)[0];
    } else {
      return null;
    }
  }, [params, categoriesList]);

  const currentCategories = useMemo(() => {
    return categoriesList.filter((item) => item.active);
  }, [categoriesList]);

  const currentProducts = useMemo(() => {
    let response = [];
    if (params?.categoryId) {
      response = productsList.filter(
        (item) => item.active && item.categoryId === params?.categoryId
      );
    } else {
      response = productsList.filter((item) => item.active);
    }

    return response;
  }, [productsList, params]);

  return (
    <ShoppingCartComponentOverlay>
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
                  onPress={() => console.log("Olá", item)}
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
              <HStack>
                <Heading>
                  Produtos
                  {category ? " de " + category.name : ""}
                </Heading>
              </HStack>
              <Divider my={4} />
            </VStack>

            {currentProducts.map((item) => (
              <VStack key={item.id} my="$1" px={"$4"}>
                <ProductItem product={item} />
              </VStack>
            ))}
            <VStack h="$10" />
          </VStack>
        </ScrollView>
      </VStack>
    </ShoppingCartComponentOverlay>
  );
}
