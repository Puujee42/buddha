import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MonkSection from "./components/Monksection";
import PhilosophySection from "./components/Philosophy";
import NirvanaComments from "./components/NirvanaComments";
import GoldenNirvanaFooter from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <MonkSection />
      <PhilosophySection />
      <NirvanaComments />
      <GoldenNirvanaFooter />
    </>
  );
}
