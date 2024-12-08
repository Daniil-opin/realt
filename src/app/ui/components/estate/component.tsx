import EstateInfo from "./info";
import EstatePhotos from "./photos";
import EstateSaler from "./saler";
import EstateTags from "./tags";

export default function EstateComponent() {
  return (
    <>
      <div className="flex items-start justify-start space-x-10">
        <div className="w-full xl:w-2/3">
          <EstatePhotos />
          <EstateTags />
          <EstateInfo />
          <div className="block xl:hidden">
            <EstateSaler />
          </div>
        </div>
        <div className="hidden xl:block xl:w-1/3">
          <EstateSaler />
        </div>
      </div>
    </>
  );
}
