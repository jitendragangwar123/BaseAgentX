import Header from "../components/Header";
import Footer from "../components/Footer";
import LandingPage from "../components/LandingPage/LandingPage";

export default async function Page() {
  return (
    <div className="">
      <Header/>
      <LandingPage />
      <Footer/>
    </div>
  );
}