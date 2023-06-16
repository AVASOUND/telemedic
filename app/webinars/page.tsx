import Webinars from "../../components/Webinars";
import Header from "../../components/Header";

export default function learnmore() {
  return (
    <main className="flex min-h-screen text-black flex-col w-full bg-white items-center">
      <Header />

      <Webinars />
    </main>
  );
}
