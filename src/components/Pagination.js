import React from "react";
import Button from "./buttons/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show around the current page
    const range = [];

    // Always show first page
    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Always show last page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Insert ellipses
    const finalPages = [];
    let last = 0;
    uniqueRange.forEach((i) => {
      if (i - last === 2) {
        finalPages.push(last + 1);
      } else if (i - last > 2) {
        finalPages.push("...");
      }
      finalPages.push(i);
      last = i;
    });

    return finalPages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="w-full bg-white py-6 shadow-md border-t border-gray-200">
      <div className="container mx-auto px-8">
        <div className=" flex justify-end items-center space-x-2">
          <Button
            variant="transparent"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="hidden sm:flex space-x-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={index} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              ) : (
                <Button
                  variant="transparent"
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`
                            px-4 py-2 text-sm font-medium rounded-lg transition duration-150 
                            ${
                              page === currentPage
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:text-indigo-600"
                            }
                        `}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button
            variant="transparent"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Pagination;
