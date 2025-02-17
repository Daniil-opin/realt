import AuthCheck from "@/app/ui/auth/check";
import { Breadcrumbs } from "@/app/ui/breadcrumbs/breadcrumbs";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";
import Header from "@/app/ui/structure/header";
import UserFavourites from "@/app/ui/user/favourites";

export default function UserFavouritesPage() {
  return (
    <AuthCheck>
      <Header />
      <Container>
        <Breadcrumbs />
        <UserFavourites />
      </Container>
      <Footer />
    </AuthCheck>
  );
}
