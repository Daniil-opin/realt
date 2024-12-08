import { Breadcrumbs } from "@/app/ui/breadcrumbs/breadcrumbs";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";
import Header from "@/app/ui/structure/header";
import UserEstates from "@/app/ui/user/estates";

export default function UserEstatesPage() {
  return (
    <>
      <Header />
      <Container>
        <Breadcrumbs />
        <UserEstates />
      </Container>
      <Footer />
    </>
  );
}