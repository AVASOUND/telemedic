import Header from "../../components/Header";
import Webinar from "../../components/Webinar";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-white flex-col items-center ">
      <Header />

      <Webinar />
    </main>
  );
}
