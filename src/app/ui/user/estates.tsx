"use client";

import EstateTable from "../table/estate";
import EstateEditCard from "../card/estate-edit";
import { useEffect, useState } from "react";
import { getUserOwnEstates } from "@/app/seed/route";
import { EstateRead } from "@/app/lib/definitions";
import Processing from "../processing/processing";
import { FilterParams } from "@/app/seed/route";
import { useSearchParams } from "next/navigation";

export default function UserEstates() {
  const [userEstates, setUserEstates] = useState<EstateRead[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchParams = useSearchParams();

  const fetchEstates = async (filters: FilterParams) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const data = await getUserOwnEstates(token);
    setUserEstates(data);

    setSearchQuery(filters.search_query || "");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const initialFilters: FilterParams = {
        deal_type: searchParams.get("deal_type") || "buy",
        property_type: searchParams.get("property_type") || undefined,
        property_kind: searchParams.get("property_kind") || undefined,
        min_price: searchParams.get("min_price")
          ? parseFloat(searchParams.get("min_price") as string)
          : undefined,
        max_price: searchParams.get("max_price")
          ? parseFloat(searchParams.get("max_price") as string)
          : undefined,
        area_range: searchParams.get("area_range") || undefined,
        sort: searchParams.get("sort") || "new",
        search_query: searchParams.get("search_query") || "",
      };
      fetchEstates(initialFilters);
    }
  }, []);

  const handleFilterChange = (filters: FilterParams) => {
    fetchEstates(filters);
  };

  return (
    <>
      <h2 className="mb-5 text-3xl font-semibold">Мои объявления</h2>
      <Processing onFilterChange={handleFilterChange} />
      <EstateTable>
        {userEstates.map((estate) => (
          <EstateEditCard
            key={estate.id}
            estate={estate}
            searchQuery={searchQuery}
          />
        ))}
      </EstateTable>
    </>
  );
}
