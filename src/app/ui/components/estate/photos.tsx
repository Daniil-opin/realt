"use client";

import Image from "next/image";
import { useState } from "react";
import ImageModal from "../../modal/image";

export default function EstatePhotos() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const openModal = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  return (
    <>
      <div className="mb-12 grid w-full grid-cols-3 grid-rows-3 gap-5 md:grid-cols-4 xl:gap-10">
        <div
          onClick={() => openModal("/images/img2.png", "Основная картинка")}
          className="relative col-start-1 col-end-4 row-start-1 row-end-4 aspect-square"
        >
          <Image
            src={"/images/img2.png"}
            layout="fill"
            alt="Картинка"
            className="cursor-pointer rounded-2xl object-cover object-center md:rounded-[20px]"
          />
        </div>
        <div
          onClick={() => openModal("/images/img2.png", "Основная картинка")}
          className="relative aspect-square"
        >
          <Image
            src={"/images/img2.png"}
            layout="fill"
            alt="Картинка"
            className="cursor-pointer rounded-2xl object-cover object-center md:rounded-[20px]"
          />
        </div>
        <div
          onClick={() => openModal("/images/img2.png", "Основная картинка")}
          className="relative aspect-square"
        >
          <Image
            src={"/images/img2.png"}
            layout="fill"
            alt="Картинка"
            className="cursor-pointer rounded-2xl object-cover object-center md:rounded-[20px]"
          />
        </div>
        <div
          onClick={() => openModal("/images/img2.png", "Основная картинка")}
          className="relative aspect-square"
        >
          <Image
            src={"/images/img2.png"}
            layout="fill"
            alt="Картинка"
            className="cursor-pointer rounded-2xl object-cover object-center md:rounded-[20px]"
          />
        </div>
      </div>
      {selectedImage && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={closeModal}
          src={selectedImage.src}
          alt={selectedImage.alt}
        />
      )}
    </>
  );
}
