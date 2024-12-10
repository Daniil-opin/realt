import {
  AddressRead,
  AmenityRead,
  CharacteristicRead,
  LocalityType,
  LocalityTypeLabels,
  PropertyKind,
  PropertyKindLabels,
  PropertyType,
  PropertyTypeLabels,
  StreetType,
  StreetTypeLabels,
} from "@/app/lib/definitions";
import YandexMap from "../../map/yandex";
import { FormattedParagraph } from "../../utils/text";
import { capitalizeFirstLetter } from "@/app/lib/utils";

const whiteCardClassName =
  "space-y-5 rounded-[20px] bg-white p-10 shadow-[0px_0px_40px_0px_rgba(0,0,0,0.05)]";

const subtitle = "text-xl font-medium";
const title = `text-black/80 ${subtitle}`;

interface EstateInfoProps {
  latitude: number;
  longitude: number;
  description: string;
  type: PropertyType;
  kind: PropertyKind;
  characteristics: CharacteristicRead;
  amenities: AmenityRead;
  address: AddressRead;
}

export default function EstateInfo({
  description,
  longitude,
  latitude,
  type,
  kind,
  characteristics,
  amenities,
  address,
}: EstateInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-10 md:mb-24 md:grid-cols-2">
      <div className={`md:col-start-1 md:col-end-3 ${whiteCardClassName}`}>
        <h6 className="text-3xl font-semibold">Описание</h6>
        <FormattedParagraph className="text-xl font-medium">
          {description}
        </FormattedParagraph>
      </div>
      <div className={`${whiteCardClassName}`}>
        <h6 className="text-3xl font-semibold">Характеристики</h6>
        <div className="flex items-start justify-between">
          <div className="grid grid-cols-1 gap-4">
            <div className={title}>Тип</div>
            <div className={title}>Год</div>
            <div className={title}>Планировка</div>
            <div className={title}>Общая площадь</div>
            <div className={title}>Жилая площадь</div>
            <div className={title}>Этаж</div>
            <div className={title}>Предоплата</div>
            <div className={title}>Срок аренды</div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className={subtitle}>{PropertyTypeLabels[type]}</div>
            <div className={subtitle}>{characteristics.year}</div>
            <div className={subtitle}>{PropertyKindLabels[kind]}</div>
            <div className={subtitle}>
              {characteristics.total_area} м<sup>2</sup>
            </div>
            <div className={subtitle}>
              {characteristics.living_area} м<sup>2</sup>
            </div>
            <div className={subtitle}>{characteristics.rooms}</div>
            <div className={subtitle}>
              {characteristics.payment ? "Есть" : "Нет"}
            </div>
            <div className={subtitle}>
              {characteristics.period ? "Длительный" : "Кратковременный"}
            </div>
          </div>
        </div>
      </div>
      {type === PropertyType.Residential && (
        <div className={`${whiteCardClassName}`}>
          <h6 className="text-3xl font-semibold">Удобства</h6>
          <div className="flex items-start justify-between">
            <div className="grid grid-cols-1 gap-4">
              <div className={title}>Кондиционер</div>
              <div className={title}>Лифт</div>
              <div className={title}>Мебель</div>
              <div className={title}>Интернет</div>
              <div className={title}>Парковка</div>
              <div className={title}>Отопление</div>
              <div className={title}>Водоснабжение</div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className={subtitle}>
                {amenities.conditioner ? "Есть" : "Нет"}
              </div>
              <div className={subtitle}>
                {amenities.elevator ? "Есть" : "Нет"}
              </div>
              <div className={subtitle}>
                {amenities.furniture ? "Есть" : "Нет"}
              </div>
              <div className={subtitle}>
                {amenities.internet ? "Есть" : "Нет"}
              </div>
              <div className={subtitle}>
                {amenities.parking ? "Есть" : "Нет"}
              </div>
              <div className={subtitle}>
                {amenities.heating ? "Есть" : "Нет"}
              </div>
              <div className={subtitle}>
                {amenities.watersupply ? "Есть" : "Нет"}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`md:col-start-1 md:col-end-3 ${whiteCardClassName}`}>
        <h6 className="text-3xl font-semibold">Местоположение</h6>
        <YandexMap
          editable={false}
          height="500px"
          initialCoordinates={[latitude, longitude]}
        />
        <div className="flex items-start justify-start space-x-10">
          <div className="grid grid-cols-1 gap-4">
            <div className={title}>Область</div>
            <div className={title}>Район</div>
            <div className={title}>Населенный пункт</div>
            <div className={title}>Улица</div>
            <div className={title}>Дом</div>
            {address.floor ? <div className={title}>Этаж</div> : <></>}
            {address.corpus ? <div className={title}>Корпус</div> : <></>}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className={subtitle}>
              {capitalizeFirstLetter(address.region || "")} область
            </div>
            <div className={subtitle}>
              {capitalizeFirstLetter(address.district || "")} район
            </div>
            <div
              className={subtitle}
            >{`${LocalityTypeLabels[address.locality_type || LocalityType.Town]} ${capitalizeFirstLetter(address.locality || "")}`}</div>
            <div
              className={subtitle}
            >{`${StreetTypeLabels[address.street_type || StreetType.Street]} ${capitalizeFirstLetter(address.street || "")}`}</div>
            <div className={subtitle}>{address.house}</div>
            {address.floor ? (
              <div className={subtitle}>{address.house}</div>
            ) : (
              <></>
            )}
            {address.corpus ? (
              <div className={subtitle}>{address.house}</div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
