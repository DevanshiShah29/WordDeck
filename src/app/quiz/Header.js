// library imports
import { ArrowLeft, Brain, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

// component imports
import Button from "@/components/buttons/Button";

const Header = ({ handleRestart }) => {
  const router = useRouter();
  return (
    <header className="bg-white backdrop-blur-sm shadow-sm border-b border-slate-200/50 z-40 relative">
      <div className="container mx-auto py-4 px-4 md:px-8">
        <div className="flex items-center gap-4 ">
          <Button variant="transparent" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-11 w-11 py-3" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Brain className={`h-5 w-5 text-blue-700`} />
              <h1 className="text-sm font-semibold tracking-wide uppercase text-gray-700">
                AI Quiz
              </h1>
            </div>
          </div>
          <Button
            varient="transparent"
            onClick={handleRestart}
            className="bg-gray-100 hover:bg-gray-200 ml-auto"
          >
            <RotateCw className="w-4 h-4 text-gray-700" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
