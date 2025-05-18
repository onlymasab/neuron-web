"use client"
import RootDownload2 from "@/components/download-2/root-download2";
import RootDownload from "@/components/download/root-download";
import RootExplore from "@/components/explore/root-explore";
import RootFaqs from "@/components/faqs/root-faqs";
import FollowUs from "@/components/followUs";
import RootFooter from "@/components/footer/root-footer";
import RootHeader from "@/components/header/root-header";
import RootNavbar from "@/components/navbar/root-navbar";
import Overview from "@/components/overview/root-overview";
import RootPricing from "@/components/pricing/root-pricing";
import RootResources from "@/components/resources/root-resources";
import RootTeam from "@/components/team/root-team";
import React from "react";


export default  function Home()  {

  

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
        <RootDownload2 />
        <RootResources />
        <RootTeam />
        <RootFaqs />
        <FollowUs />
        <RootFooter />
      </main>
    </>
  );
}