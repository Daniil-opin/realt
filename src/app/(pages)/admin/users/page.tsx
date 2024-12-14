import AdminHeader from "@/app/ui/admin/header";
import AdminUsersTable from "@/app/ui/admin/users";
import AuthCheck from "@/app/ui/auth/check";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";

export default function AdminUsersPage() {
  return (
    <AuthCheck>
      <AdminHeader />
      <Container>
        <AdminUsersTable />
      </Container>
      <Footer />
    </AuthCheck>
  );
}
