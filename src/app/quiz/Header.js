// library imports
import { ArrowLeft, Brain, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

// component imports
import Button from "@/components/buttons/Button";

const PRIMARY_COLOR_CLASS = "text-indigo-600";

const Header = ({ handleRestart }) => {
  const router = useRouter();
  return (
    <header className="bg-white backdrop-blur-sm shadow-sm border-b border-slate-200/50 z-40 relative">
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 ">
          <Button variant="transparent" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-11 w-11 py-3" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Brain className={`h-5 w-5 ${PRIMARY_COLOR_CLASS}`} />
              <h1 className="text-sm font-semibold tracking-wide uppercase text-gray-700">
                AI Vocabulary Quiz
              </h1>
            </div>
          </div>
          <Button
            varient="transparent"
            onClick={handleRestart}
            className={`text-sm text-gray-500 hover:${PRIMARY_COLOR_CLASS} transition flex items-center gap-1 w-10 h-10 justify-center rounded-full hover:bg-gray-100`}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
