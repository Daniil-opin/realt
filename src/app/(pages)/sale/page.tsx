import { Breadcrumbs } from "@/app/ui/breadcrumbs/breadcrumbs";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";
import Header from "@/app/ui/structure/header";
import UserSale from "@/app/ui/user/sale";

export default function SalePage() {
  return (
    <>
      <Header />
      <Container>
        <Breadcrumbs />
        <UserSale />
      </Container>
      <Footer />
    </>
  );
}
