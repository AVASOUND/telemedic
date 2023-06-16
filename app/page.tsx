import Hero from "../components/Hero";
import Team from "../components/Team";
import Sponsors from "../components/Sponsors";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <Sponsors />
      <Team />
    </main>
  );
}
