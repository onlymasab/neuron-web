import RootHeader from "@/components/header/root-header";
import RootNavbar from "@/components/navbar/root-navbar";
import Overview from "@/components/overview/root-overview";


export default function Home() {
  return (
    <>
      <RootHeader />
      <RootNavbar />
      <main className="w-full">
        <div className="container mx-auto px-6">
          <Overview />
        </div>
      </main>
    </>
  );
}