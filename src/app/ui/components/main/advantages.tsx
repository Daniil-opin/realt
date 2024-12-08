import Image from "next/image";
import MainCard from "../../card/main";

export default function Advantages() {
  return (
    <div className="w-full -translate-y-16 transform rounded-[60px] bg-white py-24">
      <div className="container">
        <div className="grid grid-cols-1 gap-20 xl:grid-cols-3">
          <div className="relative min-h-[500px] overflow-hidden rounded-[30px] bg-lightblue p-10 pr-[60px]">
            <h6 className="mb-4 text-3xl font-semibold leading-[1.3]">
              Новый способ найти свой новый дом
            </h6>
            <p className="leading-normal">
              Найдите место своей мечты для жизни среди более чем 10 тысяч
              объектов недвижимости, перечисленных в списке.
            </p>
            <Image
              width={600}
              height={600}
              src={"/icons/house.svg"}
              alt="Иллюстрация"
              className="absolute bottom-0 right-0 z-0 h-[260px] w-[400px] max-w-full md:h-[320px] md:w-[500px] xl:h-[220px] xl:w-[360px]"
            />
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:col-start-2 xl:col-end-4">
            <MainCard
              title="Страхование имущества"
              subtitle="Мы предлагаем нашим клиентам защиту имущества, покрытие
              ответственности и страхование для улучшения их жизни. С нами
              вы можете быть уверены, что ваше имущество под надёжной
              защитой."
              firstSrc="/icons/main/housewithmark.svg"
              firstAlt="страхование"
              secondSrc="/icons/main/locked.svg"
              secondAlt="замок"
              className="rounded-b-full"
            />
            <MainCard
              title="Лучшая цена"
              subtitle="Не уверены, сколько вам следует взимать за свою собственность? Не беспокойтесь, позвольте нам подсчитать цифры за вас. Мы проведём анализ рынка, чтобы вы могли установить конкурентоспособную цену."
              firstSrc="/icons/main/dollar.svg"
              firstAlt="цена"
              secondSrc="/icons/main/discount.svg"
              secondAlt="скидка"
              className="rounded-full"
            />
            <MainCard
              title="Самая низкая комиссия"
              subtitle="Теперь вы можете легко арендовать или купить недвижимость без лишних хлопот. Вам больше не нужно договариваться о комиссионных и торговаться с другими агентами — это обойдётся всего в 2%!"
              firstSrc="/icons/main/arrowdiscount.svg"
              firstAlt="скидка"
              secondSrc="/icons/main/sale.svg"
              secondAlt="доллар"
              className="rounded-full"
            />
            <MainCard
              title="Общий контроль"
              subtitle="Совершите виртуальный тур и запланируйте посещения, прежде чем арендовать или покупать какую‑либо недвижимость. Вы получаете полный контроль."
              firstSrc="/icons/main/location.svg"
              firstAlt="местоположение"
              secondSrc="/icons/main/house.svg"
              secondAlt="дом"
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
