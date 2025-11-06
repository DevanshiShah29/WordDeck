// components/ImageWithFallback.js
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const FALLBACK_IMAGE_SRC =
  "https://watchdiana.fail/blog/wp-content/themes/koji/assets/images/default-fallback-image.png";

export default function ImageWithFallback({ src, alt, width, height, ...rest }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Reset the source/error state if the main 'src' prop changes (e.g., pagination)
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (imgSrc !== FALLBACK_IMAGE_SRC) {
      setImgSrc(FALLBACK_IMAGE_SRC);
      setHasError(true);
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
      className={hasError ? "opacity-70 border-2 border-red-300" : ""}
    />
  );
}
