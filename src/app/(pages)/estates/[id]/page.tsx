"use client";

import { EstateRead } from "@/app/lib/definitions";
import { getEstateById } from "@/app/seed/route";
import AdminHeader from "@/app/ui/admin/header";
import { Breadcrumbs } from "@/app/ui/breadcrumbs/breadcrumbs";
import EstateComponent from "@/app/ui/components/estate/component";
import { AuthContext } from "@/app/ui/context/auth";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";
import Header from "@/app/ui/structure/header";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function BuyEstatePage() {
  const params = useParams();
  const { isAdmin } = useContext(AuthContext);
  const [estate, setEstate] = useState<EstateRead | null>(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (!id) {
      toast.error("ID недвижимости отсутствует.");
      return;
    }

    const estateId = Array.isArray(id) ? id[0] : id;

    if (typeof estateId !== "string") {
      toast.error("Некорректный формат ID недвижимости.");
      return;
    }

    const estateIdNumber = parseInt(estateId, 10);
    if (isNaN(estateIdNumber)) {
      toast.error("ID недвижимости должно быть числом.");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getEstateById(estateIdNumber);
        setEstate(res);
      } catch (error) {
        toast.error("Не получилось получить estate по id.");
        router.back();
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  if (!estate) {
    return (
      <>
        {isAdmin ? <AdminHeader /> : <Header />}
        <Container>
          <p>Загрузка...</p>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      {isAdmin ? <AdminHeader /> : <Header />}
      <Container>
        <Breadcrumbs />
        <EstateComponent estate={estate} />
      </Container>
      <Footer />
    </>
  );
}
