import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import "./generateAI.css";
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
  title: "WordSpark | Ignite Your Vocabulary Power",

  description:
    "WordSpark provides fast, engaging quizzes and personalized tracking to help you rapidly expand your word knowledge. Start mastering complex vocabulary today!",

  keywords:
    "vocabulary app, word quiz, learn new words, improve vocabulary, language fluency, WordSpark, word game, spaced repetition",

  // OpenGraph (OG) Metadata for Social Media Sharing (e.g., Facebook, LinkedIn)
  openGraph: {
    title: "WordSpark: Ignite Your Vocabulary Power",
    description:
      "Rapidly expand your word knowledge with fast, engaging quizzes and personalized tracking.",
    url: "https://your-app-domain.com", // REPLACE with your actual domain
    siteName: "WordSpark",
    images: [
      {
        url: "https://your-app-domain.com/og-banner.jpg", //  REPLACE with a link to your app's banner image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "WordSpark Vocabulary App Screenshot",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={` ${montserrat.variable} ${noto_sans.variable} `}>
      <body className={`antialiased`}>
        <AuthGuard>{children}</AuthGuard>
        <ToastContainer
          position="top-right"
          autoClose={3000}
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
