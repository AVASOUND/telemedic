import Header from "../../../components/Header";
import AppointmentRoom from "../../../components/AppointmentRoom";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-white flex-col items-center ">
      <Header />
      <AppointmentRoom />
    </main>
  );
}
