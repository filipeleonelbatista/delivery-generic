import { useEffect } from "react";
import { useConfig } from "../hooks/useConfig";
import defaultFavicon from "../assets/defaultFavicon.png";

export default function SEO({ title = null }) {
  const { config } = useConfig();

  const changeFavicon = (url) => {
    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/png";
    link.rel = "icon";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  };

  const updateMetaTags = () => {
    document.title =
      (title ? title + " | " : "") +
      (config.name ?? "MyStore") +
      " | " +
      (config.subtitle ?? "Seus produtos a um toque");

    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.content = config.about;
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = config.about;
      document.getElementsByTagName("head")[0].appendChild(newMeta);
    }

    // const metaKeywords = document.querySelector("meta[name='keywords']");
    // if (metaKeywords) {
    //   metaKeywords.content = "Palavras-chave, SEO, React";
    // } else {
    //   const newMeta = document.createElement("meta");
    //   newMeta.name = "keywords";
    //   newMeta.content = "Palavras-chave, SEO, React";
    //   document.getElementsByTagName("head")[0].appendChild(newMeta);
    // }
  };

  useEffect(() => {
    if (config) {
      changeFavicon(config.favicon ? config.favicon : defaultFavicon);
      updateMetaTags();
    }
  }, [config]);

  return null;
}
