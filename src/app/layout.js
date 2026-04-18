// Library Imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import "./variables.css";
import "./generateAI.css";
import "./relations.css";

// Component Imports
import AuthGuard from "@/components/AuthGuard";
import { Montserrat, Noto_Sans } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata = {
  title: "WordSmith",
  description:
    "WordSmith provides fast, engaging quizzes and personalized tracking to help you rapidly expand your word knowledge. Start mastering complex vocabulary today!",
  keywords:
    "vocabulary app, word quiz, learn new words, improve vocabulary, language fluency, wordsmith, word game, spaced repetition",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  // OpenGraph (OG) Metadata for Social Media Sharing (e.g., Facebook, LinkedIn)
  openGraph: {
    title: "WordSmith: Ignite Your Vocabulary Power",
    description:
      "Rapidly expand your word knowledge with fast, engaging quizzes and personalized tracking.",
    url: "https://www.wordsmithtool.netlify.app",
    siteName: "WordSmith",
    images: [
      {
        url: "https://your-app-domain.com/og-banner.jpg", //  REPLACE with a link to your app's banner image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "WordSmith Vocabulary App Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fff" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={` ${montserrat.variable} ${noto_sans.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthGuard>{children}</AuthGuard>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
