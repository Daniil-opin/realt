import { Deal, EstateRead } from "@/app/lib/definitions";
import EstateInfo from "./info";
import EstatePhotos from "./photos";
import EstateSaler from "./saler";
import EstateTags from "./tags";

export default function EstateComponent({ estate }: { estate: EstateRead }) {
  return (
    <div className="flex items-start justify-start space-x-10">
      <div className="w-full xl:w-2/3">
        <EstatePhotos images={estate.images} />
        {estate.characteristics && (
          <EstateTags characteristics={estate.characteristics} />
        )}
        {estate.description && estate.characteristics && estate.address && (
          <EstateInfo
            latitude={estate.latitude}
            longitude={estate.longitude}
            kind={estate.property_kind}
            type={estate.property_type}
            description={estate.description || ""}
            characteristics={estate.characteristics}
            amenities={estate.amenities}
            address={estate.address}
          />
        )}
        <div className="block xl:hidden">
          <EstateSaler
            type={estate.deal_type as Deal}
            price={estate.characteristics?.price || 0}
            owner={estate.owner}
          />
        </div>
      </div>
      <div className="hidden xl:block xl:w-1/3">
        <EstateSaler
          type={estate.deal_type as Deal}
          price={estate.characteristics?.price || 0}
          owner={estate.owner}
        />
      </div>
    </div>
  );
}
