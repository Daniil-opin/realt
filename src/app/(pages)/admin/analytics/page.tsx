import AdminAnalytics from "@/app/ui/admin/analytics";
import AdminHeader from "@/app/ui/admin/header";
import Container from "@/app/ui/structure/container";
import Footer from "@/app/ui/structure/footer";

export default function AdminAnalyticsPage() {
  return (
    <>
      <AdminHeader />
      <Container>
        <AdminAnalytics />
      </Container>
      <Footer />
    </>
  );
}
