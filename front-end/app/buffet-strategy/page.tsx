import Header from "../components/Header";
import Footer from "../components/Footer";
import BuffetStrategy from "../components/BuffetStrategy/BuffetStrategy";

export default async function Page() {
  return (
    <div className=" ">
      <Header/>
      <BuffetStrategy />
      <Footer/>
    </div>
  );
}