import { LandingPage } from "@/components/LandingPage";
import { landingMetadata } from "@/i18n/metadata";

export const metadata = landingMetadata("ro");

export default function HomePage() {
  return <LandingPage locale="ro" />;
}
