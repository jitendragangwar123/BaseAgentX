"use client";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Link from "next/link";
import UpRightArrowIcon from "./svg/UpRightArrowIcon";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: 'url("/landing.png")',
          filter: "blur(4px)",
        }}
      ></div>
      <Header />
      <div className="flex flex-col items-center justify-center font-arcade min-h-screen py-10 mt-6 bg-gradient-to-b from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 px-4 sm:px-8 md:px-16">
        <div className="flex flex-col-reverse items-center justify-center w-full max-w-6xl gap-10 md:gap-16 mb-5 text-center lg:flex-row lg:text-left">
          <div className="flex flex-col w-full lg:w-1/2 px-4 md:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase z-0 leading-tight">
              Transform Your <span className="text-green-600">Real World Asset</span> Investment Strategies with <br className="hidden md:block" /> AI-powered Agents
            </h1>
            <div className="flex gap-4 z-0 justify-center lg:justify-start">
              <Link href="/landing-page" legacyBehavior>
                <a className="flex items-center justify-center gap-3 mt-8 px-6 py-4 border border-white bg-transparent hover:bg-white hover:text-black transition rounded-lg text-lg uppercase">
                  <span>Start Exploring</span>
                  <UpRightArrowIcon />
                </a>
              </Link>
            </div>
          </div>
          <div className="flex justify-center w-full lg:w-1/2 lg:justify-end">
            <Image
              className="relative transition duration-700 ease-in-out transform hover:scale-105 dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
              src="/robo.png"
              alt="gif"
              width={500}
              height={250}
              priority
            />
          </div>
        </div>
      </div>
      <div className="relative z-0">
        <Footer />
      </div>
    </main>
  );
}