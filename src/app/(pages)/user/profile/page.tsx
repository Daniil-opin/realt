import { Breadcrumbs } from "@/app/ui/breadcrumbs/breadcrumbs";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";
import Header from "@/app/ui/structure/header";
import UserProfile from "@/app/ui/user/profile";

export default function UserProfilePage() {
  return (
    <>
      <Header />
      <Container>
        <Breadcrumbs />
        <UserProfile />
      </Container>
      <Footer />
    </>
  );
}
