import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      className="flex cursor-pointer items-center justify-start space-x-2"
    >
      <Image src={"/icons/iconLogo.svg"} width={25} height={25} alt="Логотип" />
      <h1 className="font-poppins text-3xl font-bold">Realty</h1>
    </div>
  );
}
