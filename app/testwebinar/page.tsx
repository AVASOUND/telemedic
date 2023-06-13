import Hero from "../../components/Hero";
import Team from "../../components/Team";
import Webinar from "../../components/Webinar"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <Webinar />
    </main>
  );
}
