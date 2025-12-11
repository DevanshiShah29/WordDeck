// components/ImageWithFallback.js
"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE_SRC =
  "https://watchdiana.fail/blog/wp-content/themes/koji/assets/images/default-fallback-image.png";

// Utility function to check if the source is an actual non-empty string URL.
const isValidSrc = (src) => typeof src === "string" && src.length > 0;

export default function ImageWithFallback({ src, alt, width, height, ...rest }) {
  //  Initialize the source state. If the provided 'src' is invalid (null, ""), immediately start with the FALLBACK_IMAGE_SRC to prevent the "missing src" error.
  const initialSrc = isValidSrc(src) ? src : FALLBACK_IMAGE_SRC;
  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [isFallback, setIsFallback] = useState(initialSrc === FALLBACK_IMAGE_SRC);

  const handleError = () => {
    if (imgSrc !== FALLBACK_IMAGE_SRC) {
      setImgSrc(FALLBACK_IMAGE_SRC);
      setIsFallback(true);
    }
  };

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={handleError}
      className={
        isFallback ? `${rest.className || ""} opacity-70 border-2 border-red-300` : rest.className
      }
    />
  );
}
