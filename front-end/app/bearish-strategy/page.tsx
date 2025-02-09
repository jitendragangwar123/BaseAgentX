import Header from "../components/Header";
import Footer from "../components/Footer";
import BearishStrategy from "../components/BearishStrategy/BearishStrategy";

export default async function Page() {
  return (
    <div className=" ">
      <Header/>
      <BearishStrategy />
      <Footer/>
    </div>
  );
}