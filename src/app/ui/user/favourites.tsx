"use client";

import { useEffect, useState } from "react";
import EstateCard from "../card/estate";
import Processing from "../processing/processing";
import EstateTable from "../table/estate";
import { EstateRead } from "@/app/lib/definitions";
import { getUserFavorites, FilterParams } from "@/app/seed/route";

export default function UserFavourites() {
  const [rawEstates, setRawEstates] = useState<EstateRead[]>([]);
  const [filteredEstates, setFilteredEstates] = useState<EstateRead[]>([]);
  const [filters, setFilters] = useState<FilterParams>({
    deal_type: "buy",
    sort: "new",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchEstates = async () => {
        const data = await getUserFavorites(token);
        setRawEstates(data);
      };
      fetchEstates();
    }
  }, []);

  useEffect(() => {
    let result = [...rawEstates];

    if (filters.deal_type) {
      result = result.filter(
        (estate) => estate.deal_type === filters.deal_type,
      );
    }

    if (filters.property_type) {
      result = result.filter(
        (estate) => estate.property_type === filters.property_type,
      );
    }

    if (filters.property_kind) {
      result = result.filter(
        (estate) => estate.property_kind === filters.property_kind,
      );
    }

    if (filters.min_price !== undefined) {
      result = result.filter(
        (estate) => (estate.characteristics?.price ?? 0) >= filters.min_price!,
      );
    }
    if (filters.max_price !== undefined) {
      result = result.filter(
        (estate) => (estate.characteristics?.price ?? 0) <= filters.max_price!,
      );
    }

    if (filters.area_range) {
      const totalArea = (estate: EstateRead) =>
        estate.characteristics?.total_area ?? 0;
      if (filters.area_range === "0-50") {
        result = result.filter((estate) => totalArea(estate) <= 50);
      } else if (filters.area_range === "50-100") {
        result = result.filter(
          (estate) => totalArea(estate) >= 50 && totalArea(estate) <= 100,
        );
      } else if (filters.area_range === "100+") {
        result = result.filter((estate) => totalArea(estate) > 100);
      }
    }

    if (filters.search_query) {
      const query = filters.search_query.toLowerCase();
      result = result.filter((estate) => {
        const parts: string[] = [];
        if (estate.address) {
          const { region, district, locality, street_type, street, house } =
            estate.address;
          if (street_type && street) parts.push(street);
          if (house) parts.push(house);
          if (locality) parts.push(locality);
          if (district) parts.push(district);
          if (region) parts.push(region);
        }
        const fullAddress = parts.join(" ").toLowerCase();
        return fullAddress.includes(query);
      });
    }

    // Сортировка
    if (filters.sort) {
      if (filters.sort === "new") {
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      } else if (filters.sort === "priceAsc") {
        result.sort(
          (a, b) =>
            (a.characteristics?.price ?? 0) - (b.characteristics?.price ?? 0),
        );
      } else if (filters.sort === "priceDesc") {
        result.sort(
          (a, b) =>
            (b.characteristics?.price ?? 0) - (a.characteristics?.price ?? 0),
        );
      } else if (filters.sort === "areaAsc") {
        result.sort(
          (a, b) =>
            (a.characteristics?.total_area ?? 0) -
            (b.characteristics?.total_area ?? 0),
        );
      } else if (filters.sort === "areaDesc") {
        result.sort(
          (a, b) =>
            (b.characteristics?.total_area ?? 0) -
            (a.characteristics?.total_area ?? 0),
        );
      }
    }

    setFilteredEstates(result);
  }, [rawEstates, filters]);

  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
  };

  return (
    <>
      <h2 className="mb-5 text-3xl font-semibold">Избранное</h2>
      <Processing onFilterChange={handleFilterChange} />
      <EstateTable>
        {filteredEstates.map((estate) => (
          <EstateCard key={estate.id} estate={estate} />
        ))}
      </EstateTable>
    </>
  );
}
