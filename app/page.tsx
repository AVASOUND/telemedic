import Image from "next/image";
import Hero from "../components/Hero";
import Team from "../components/Team";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <Team />
      <Footer />
    </main>
  );
}
