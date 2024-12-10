import { Breadcrumbs } from "@/app/ui/breadcrumbs/breadcrumbs";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";
import Header from "@/app/ui/structure/header";
import EditEstatePage from "@/app/ui/user/edit-sale";

export default function EditSalePage() {
  return (
    <>
      <Header />
      <Container>
        <Breadcrumbs />
        <EditEstatePage />
      </Container>
      <Footer />
    </>
  );
}
