"use client";

import { useState } from "react";
import Image from "next/image";

type ExperienceDetailImageProps = {
  imageUrl: string;
  title: string;
};

export function ExperienceDetailImage({ imageUrl, title }: ExperienceDetailImageProps) {
  const [src, setSrc] = useState(imageUrl);

  return (
    <Image
      className="detail-image"
      src={src}
      alt={title}
      fill
      priority
      sizes="(max-width: 48rem) 100vw, (max-width: 76rem) 65vw, 52rem"
      onError={() => {
        if (src !== "/images/experiences/placeholder.svg") {
          setSrc("/images/experiences/placeholder.svg");
        }
      }}
    />
  );
}
