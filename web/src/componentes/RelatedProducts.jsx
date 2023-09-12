import { useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import FeaturedPost from "./FeaturedPost";

function RelatedProducts({ categoryId }) {
  const { productsList } = useProducts();

  const posts = useMemo(() => {
    const response = productsList.filter(
      (item) => item.active && item.categoryId === categoryId
    );
    return response;
  }, [productsList, categoryId]);

  if (posts.length === 0) return null;

  return (
    <swiper-container
      controller-control="featured-product-swiper"
      slides-per-view="2"
      speed={500}
      loop={true}
      autoPlay={true}
      delay={10000}
      pauseOnMouseEnter={true}
      navigation={true}
      pagination={true}
    >
      {posts.map((post) => (
        <swiper-slide key={post.id} style={{paddingBottom: 32}}>
          <FeaturedPost post={post} />
        </swiper-slide>
      ))}
    </swiper-container>
  );
}
export default RelatedProducts;
