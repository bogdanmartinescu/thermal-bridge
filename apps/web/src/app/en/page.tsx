import { LandingPage } from "@/components/LandingPage";
import { landingMetadata } from "@/i18n/metadata";

export const metadata = landingMetadata("en");

export default function EnglishHomePage() {
  return <LandingPage locale="en" />;
}
