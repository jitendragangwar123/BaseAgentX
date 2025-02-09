import Header from "../components/Header";
import Footer from "../components/Footer";
import BullishStrategy from "../components/BullishStrategy/BullishStrategy";

export default async function Page() {
  return (
    <div className=" ">
      <Header/>
      <BullishStrategy />
      <Footer/>
    </div>
  );
}