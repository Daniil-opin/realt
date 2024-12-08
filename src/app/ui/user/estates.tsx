import Image from "next/image";
import EstateTable from "../table/estate";
import EstateCard from "../card/estate";

export default function UserEstates() {
  return (
    <>
      <h2 className="mb-5 text-3xl font-semibold">Мои объявления</h2>
      <div className="mb-12 flex w-full items-stretch justify-between">
        <div className="relative w-full max-w-[500px]">
          <Image
            width={24}
            height={24}
            src={"/icons/iconSearch.svg"}
            alt="Поиск"
            className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer"
          />
          <input
            id="search"
            placeholder="Поиск"
            type="text"
            className="min-h-14 w-full rounded-xl border border-smooth bg-transparent bg-white pl-14 pr-5 font-medium leading-none text-black placeholder:text-base placeholder:text-greyblue focus-within:border-blue focus:outline-none"
          />
        </div>
      </div>
      <EstateTable>
        <EstateCard />
      </EstateTable>
    </>
  );
}
