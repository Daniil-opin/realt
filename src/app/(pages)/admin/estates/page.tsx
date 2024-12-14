import AdminPropertyTable from "@/app/ui/admin/estates";
import AdminHeader from "@/app/ui/admin/header";
import AuthCheck from "@/app/ui/auth/check";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";

export default function AdminEstatesPage() {
  return (
    <AuthCheck>
      <AdminHeader />
      <Container>
        <AdminPropertyTable />
      </Container>
      <Footer />
    </AuthCheck>
  );
}
