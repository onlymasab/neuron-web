import RootDownload from "@/components/download/root-download";
import RootExplore from "@/components/explore/root-explore";
import RootHeader from "@/components/header/root-header";
import RootNavbar from "@/components/navbar/root-navbar";
import Overview from "@/components/overview/root-overview";
import RootPricing from "@/components/pricing/root-pricing";


export default function Home() {
  return (
    <>
      <RootHeader />
      <RootNavbar />
      <main className="w-full">
        <div className="container mx-auto px-6">
          <Overview />
          <RootDownload />
          <RootExplore />
        </div>
        <RootPricing />
      </main>
    </>
  );
}