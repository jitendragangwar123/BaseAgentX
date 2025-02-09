import Header from "../components/Header";
import Footer from "../components/Footer";
import MoonStrategy from "../components/MoonStrategy/MoonStrategy";

export default async function Page() {
  return (
    <div className="">
      <Header/>
      <MoonStrategy />
      <Footer/>
    </div>
  );
}