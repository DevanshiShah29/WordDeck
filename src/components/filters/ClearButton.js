import React from "react";
import Button from "../buttons/Button";
import { CircleX } from "lucide-react";

const ClearButton = ({ onClick }) => (
  <Button
    variant="transparent"
    onClick={onClick}
    className="text-sm font-medium text-red-500 hover:text-red-700 p-1 transition"
  >
    Clear
    <CircleX size={14} className="ml-1" />
  </Button>
);

export default ClearButton;
