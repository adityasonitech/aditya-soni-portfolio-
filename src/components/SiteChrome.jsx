"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import WhatsAppButton from "./WhatsAppButton";
import IntroLoader from "./motion/IntroLoader";
import Spotlight from "./motion/Spotlight";
import ScrollProgress from "./motion/ScrollProgress";

/** Everything that wraps the public site. Admin pages get none of it. */
export default function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard-ctrl") || pathname?.startsWith("/portal-access")) {
    return null;
  }

  return (
    <>
      <IntroLoader />
      <Spotlight />
      <ScrollProgress />
      <Navbar />
      <WhatsAppButton />
    </>
  );
}
