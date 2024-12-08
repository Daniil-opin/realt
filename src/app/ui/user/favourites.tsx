import EstateCard from "../card/estate";
import Processing from "../processing/processing";
import EstateTable from "../table/estate";

export default function UserFavourites() {
  return (
    <>
      <h2 className="mb-5 text-3xl font-semibold">Избранное</h2>
      <Processing />
      <EstateTable>
        <EstateCard />
        <EstateCard />
        <EstateCard />
        <EstateCard />
        <EstateCard />
        <EstateCard />
      </EstateTable>
    </>
  );
}
