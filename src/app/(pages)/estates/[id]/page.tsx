"use client";

import { EstateRead } from "@/app/lib/definitions";
import { getEstateById } from "@/app/seed/route";
import { Breadcrumbs } from "@/app/ui/breadcrumbs/breadcrumbs";
import EstateComponent from "@/app/ui/components/estate/component";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";
import Header from "@/app/ui/structure/header";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BuyEstatePage() {
  const params = useParams();
  const [estate, setEstate] = useState<EstateRead | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    if (!id) {
      setError("ID недвижимости отсутствует.");
      return;
    }

    const estateId = Array.isArray(id) ? id[0] : id;

    if (typeof estateId !== "string") {
      setError("Некорректный формат ID недвижимости.");
      return;
    }

    const estateIdNumber = parseInt(estateId, 10);
    if (isNaN(estateIdNumber)) {
      setError("ID недвижимости должно быть числом.");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getEstateById(estateIdNumber);
        setEstate(res);
      } catch (error) {
        setError("Не получилось получить estate по id.");
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  if (error) {
    return (
      <>
        <Header />
        <Container>
          <p style={{ color: "red" }}>{error}</p>
        </Container>
        <Footer />
      </>
    );
  }

  if (!estate) {
    return (
      <>
        <Header />
        <Container>
          <p>Загрузка...</p>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container>
        <Breadcrumbs />
        <EstateComponent estate={estate} />
      </Container>
      <Footer />
    </>
  );
}
