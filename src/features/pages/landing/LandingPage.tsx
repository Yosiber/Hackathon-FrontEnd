import LandingNavbar from "./components/LandingNavbar";
import LandingHero from "./components/LandingHero";
import LandingFeatures from "./components/LandingFeatures";
import LandingCarousel from "./components/LandingCarousel";
import LandingFooter from "./components/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingCarousel />
      </main>
      <LandingFooter />
    </div>
  );
}
