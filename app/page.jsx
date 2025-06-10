import { FeatureOverview } from "@/components/FeatureOverview";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Navigation } from "@/components/Navigation";
import { PricingSection } from "@/components/PricingSection";
import { Testimonials } from "@/components/Testimonials";
import { TrustBadges } from "@/components/TrustBadges";

const Page = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <TrustBadges />
      <FeatureOverview />
      <HowItWorks />
      <Testimonials />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Page;