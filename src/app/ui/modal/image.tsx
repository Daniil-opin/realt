import React from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export default function ImageModal({ isOpen, onClose, src, alt }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="relative overflow-hidden rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <XMarkIcon
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 cursor-pointer rounded-sm bg-black/80 p-1 text-white focus:outline-none"
        />
        <div className="max-h-screen max-w-3xl">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  );
}
