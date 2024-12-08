import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white py-12 text-greyblue">
      <div className="container grid grid-cols-1 items-center justify-between gap-x-10 lg:grid-cols-[1fr_auto_auto]">
        <h6>© 2024 Realty. Все права защищены</h6>
        <Link className="text-greyblue" href={"#"}>
          Условия использования
        </Link>
        <Link className="text-greyblue" href={"#"}>
          Политика конфиденциальности
        </Link>
      </div>
    </footer>
  );
}
