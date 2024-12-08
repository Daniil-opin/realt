import YandexMapInteractive from "../../map/yandex";
import { FormattedParagraph } from "../../utils/text";

const whiteCardClassName =
  "space-y-5 rounded-[20px] bg-white p-10 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.05)]";

const subtitle = "text-xl font-medium";
const title = `text-black/80 ${subtitle}`;

export default function EstateInfo() {
  return (
    <div className="grid grid-cols-1 gap-10 md:mb-24 md:grid-cols-2">
      <div className={`md:col-start-1 md:col-end-3 ${whiteCardClassName}`}>
        <h6 className="text-3xl font-semibold">Описание</h6>
        <FormattedParagraph className="text-xl font-medium">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
          commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus. Donec quam
          felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
          consequat massa quis enim. Donec pede justo, fringilla vel, aliquet
          nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a,
          venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.
          Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
          vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat
          vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra
          quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius
          laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel
          augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.
        </FormattedParagraph>
      </div>
      <div className={`${whiteCardClassName}`}>
        <h6 className="text-3xl font-semibold">Характеристики</h6>
        <div className="flex items-start justify-between">
          <div className="grid grid-cols-1 gap-4">
            <div className={title}>Тип</div>
            <div className={title}>Год</div>
            <div className={title}>Планировка</div>
            <div className={title}>Ремонт</div>
            <div className={title}>Парковка</div>
            <div className={title}>Предоплата</div>
            <div className={title}>Срок аренды</div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className={subtitle}>Частный дом</div>
            <div className={subtitle}>2019</div>
            <div className={subtitle}>Пентхаус</div>
            <div className={subtitle}>Евроремонт</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Месяц</div>
            <div className={subtitle}>Длительный</div>
          </div>
        </div>
      </div>
      <div className={`${whiteCardClassName}`}>
        <h6 className="text-3xl font-semibold">Удобства</h6>
        <div className="flex items-start justify-between">
          <div className="grid grid-cols-1 gap-4">
            <div className={title}>Холодильник</div>
            <div className={title}>Телевизор</div>
            <div className={title}>Кофеварка</div>
            <div className={title}>Микроволновая печь</div>
            <div className={title}>Тостер</div>
            <div className={title}>Посудомоечная машина</div>
            <div className={title}>Кондиционер</div>
            <div className={title}>Плита</div>
            <div className={title}>СВЧ-печь</div>
            <div className={title}>Стиральная машина</div>
            <div className={title}>Пылесос</div>
            <div className={title}>Wi-Fi</div>
            <div className={title}>Отопление</div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
            <div className={subtitle}>Есть</div>
          </div>
        </div>
      </div>
      <div className={`md:col-start-1 md:col-end-3 ${whiteCardClassName}`}>
        <h6 className="text-3xl font-semibold">Местоположение</h6>
        <YandexMapInteractive mode="view" fixedLocation={[53.9, 27.5667]} />
        <div className="flex items-start justify-start space-x-10">
          <div className="grid grid-cols-1 gap-4">
            <div className={title}>Область</div>
            <div className={title}>Населенный пункт</div>
            <div className={title}>Улица</div>
            <div className={title}>Дом</div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className={subtitle}>Минская область</div>
            <div className={subtitle}>г. Минск</div>
            <div className={subtitle}>ул. Петра Мстиславца</div>
            <div className={subtitle}>12</div>
          </div>
        </div>
      </div>
    </div>
  );
}
