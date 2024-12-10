"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/app/ui/breadcrumbs/breadcrumbs";
import EstateCard from "@/app/ui/card/estate";
import Processing from "@/app/ui/processing/processing";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";
import Header from "@/app/ui/structure/header";
import EstateTable from "@/app/ui/table/estate";
import { EstateRead } from "@/app/lib/definitions";
import { FilterParams, getFilteredEstates } from "@/app/seed/route";

export default function EstatesPage() {
  const [estates, setEstates] = useState<EstateRead[]>([]);
  const searchParams = useSearchParams();

  const fetchEstates = async (filters: FilterParams) => {
    const data = await getFilteredEstates(filters);
    setEstates(data);
  };

  useEffect(() => {
    const filters: FilterParams = {
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
      search_query: searchParams.get("search_query") || undefined,
    };

    fetchEstates(filters);
  }, [searchParams]);

  const dealType = searchParams.get("deal_type") || "buy";

  return (
    <>
      <Header />
      <Container>
        <Breadcrumbs />
        <h2 className="mb-5 text-3xl font-semibold">
          {dealType === "rent" ? "Аренда" : "Купля"} недвижимости
        </h2>
        <Processing />
        <EstateTable>
          {estates.map((estate) => (
            <EstateCard
              estate={estate}
              key={estate.id}
              searchQuery={searchParams.get("search_query") || ""}
            />
          ))}
        </EstateTable>
      </Container>
      <Footer />
    </>
  );
}
