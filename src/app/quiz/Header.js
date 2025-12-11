// library imports
import { RotateCw } from "lucide-react";

// component imports
import Button from "@/components/buttons/Button";
import PageHeader from "@/components/header/PageHeader";

const Header = ({ handleRestart }) => {
  const restartButton = (
    <Button
      variant="transparent"
      onClick={handleRestart}
      className="bg-[var(--slate-100)] group p-3 hover:bg-[var(--primary-100)]"
    >
      <RotateCw className="w-4 h-4 text-[var(--slate-700)] group-hover:text-[var(--primary)]" />
    </Button>
  );

  return (
    <PageHeader
      title="AI Quiz"
      subtitle="Take the quiz to test your knowledge"
      actions={restartButton}
    />
  );
};

export default Header;
