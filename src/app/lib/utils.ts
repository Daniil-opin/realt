import { API_BASE_URL } from "../seed/route";
import Typograf from "typograf";

const tp = new Typograf({ locale: ["ru", "en-US"] });

tp.enableRule("ru/nbsp/afterShortWord");

export function formatText(text: string): string {
  return tp.execute(text);
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getScrollbarWidth(): number {
  const scrollDiv = document.createElement("div");

  scrollDiv.style.visibility = "hidden";
  scrollDiv.style.overflow = "scroll";
  scrollDiv.style.position = "absolute";
  scrollDiv.style.top = "-9999px";
  scrollDiv.style.width = "50px";
  scrollDiv.style.height = "50px";

  document.body.appendChild(scrollDiv);

  const innerDiv = document.createElement("div");
  innerDiv.style.width = "100%";
  scrollDiv.appendChild(innerDiv);

  const scrollbarWidth = scrollDiv.offsetWidth - innerDiv.offsetWidth;

  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}

export function splitParam<T>(param: T): string[] {
  return param && typeof param === "string" ? param.split(",") : [];
}

export const getProcessedSrc = (src: string): string => {
  if (!src) {
    throw new Error("Пустой src передан в getProcessedSrc");
  }

  if (src.startsWith("data:image")) {
    return src;
  }

  if (!src.startsWith("http://") && !src.startsWith("https://")) {
    return `${API_BASE_URL}${src}?t=${new Date().getTime()}`;
  }

  return `${src}?t=${new Date().getTime()}`;
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
