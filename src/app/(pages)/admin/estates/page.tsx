import AdminPropertyTable from "@/app/ui/admin/estates";
import AdminHeader from "@/app/ui/admin/header";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";

export default function AdminEstatesPage() {
  return (
    <>
      <AdminHeader />
      <Container>
        <AdminPropertyTable />
      </Container>
      <Footer />
    </>
  );
}
