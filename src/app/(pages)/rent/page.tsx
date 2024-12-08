import { Breadcrumbs } from "@/app/ui/breadcrumbs/breadcrumbs";
import EstateComponent from "@/app/ui/components/estate/component";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";
import Header from "@/app/ui/structure/header";

export default function RentPage() {
  return (
    <>
      <Header />
      <Container>
        <Breadcrumbs />
        <EstateComponent />
      </Container>
      <Footer />
    </>
  );
}
