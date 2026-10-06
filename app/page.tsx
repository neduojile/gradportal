import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Stats from "@/components/landing/stats";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import JobsPreview from "@/components/landing/jobs-preview";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffaf5] text-slate-950">
      <Navbar />

      <main className="relative">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <JobsPreview />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
