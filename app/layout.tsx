import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TopNav } from "@/components/top-nav";
import { OnboardingGate } from "@/components/onboarding/onboarding-gate";
import { PopupPresenter } from "@/components/popup-presenter";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hành Trình — Wellness & Goals",
  description: "Lịch trình hằng ngày, mục tiêu tháng, và phiên tập chánh niệm.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1929" },
  ],
  width: "device-width",
  initialScale: 1,
};

const antiFoucScript = `(function(){try{var s=JSON.parse(localStorage.getItem('hanhtrinh.settings')||'{}');var t;if(s.autoTheme===false&&s.manualTheme){t=s.manualTheme;}else{var h=new Date().getHours();t=(h>=6&&h<18)?'light':'dark';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${jakarta.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFoucScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans theme-transition">
        <ThemeProvider>
          <TopNav />
          <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
            {children}
          </main>
          <OnboardingGate />
          <PopupPresenter />
        </ThemeProvider>
      </body>
    </html>
  );
}
