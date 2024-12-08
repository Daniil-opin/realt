import Promo from "./ui/components/main/promo";
import Header from "./ui/structure/header";
import Advantages from "./ui/components/main/advantages";
import Estate from "./ui/components/main/estates";
import Footer from "./ui/structure/footer";

export default function Home() {
  return (
    <>
      <Header />
      <Promo />
      <Advantages />
      <Estate />
      <Footer />
    </>
  );
}
