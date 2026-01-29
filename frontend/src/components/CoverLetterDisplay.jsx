import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Copy, Download, RotateCcw, CheckCheck, Sparkles } from "lucide-react";
import { generatePDF } from "../utils/pdfGenerator";
import toast from "react-hot-toast";

const CoverLetterDisplay = ({
  content,
  onContentChange,
  onRephrase,
  onGrammarCheck,
  onRegenerate,
  userDetails,
  isLoading,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const formats = ["header", "bold", "italic", "underline", "list", "bullet"];

  const handleCopy = async () => {
    try {
      const plainText = content.replace(/<[^>]*>/g, "");
      await navigator.clipboard.writeText(plainText);
      setIsCopied(true);
      toast.success("Cover letter copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    try {
      const plainText = content.replace(/<[^>]*>/g, "");
      generatePDF(plainText, userDetails.name, userDetails.email);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      toast.error("Failed to generate PDF");
    }
  };

  const actionButtons = [
    {
      label: "Rephrase",
      icon: Sparkles,
      onClick: onRephrase,
      color: "from-cyan-400 to-blue-500", // Matches blue/cyan spheres
      description: "Rewrite with different wording",
    },
    {
      label: "Grammar Check",
      icon: CheckCheck,
      onClick: onGrammarCheck,
      color: "from-teal-400 to-emerald-500", // Complements cyan
      description: "Fix grammar and spelling",
    },
    {
      label: "Regenerate",
      icon: RotateCcw,
      onClick: onRegenerate,
      color: "from-blue-500 to-indigo-600", // Matches darker blue elements
      description: "Generate completely new version",
    },
    {
      label: isCopied ? "Copied!" : "Copy",
      icon: Copy,
      onClick: handleCopy,
      color: "from-gray-500 to-slate-600", // Neutral but sleek
      description: "Copy to clipboard",
    },
    {
      label: "Download PDF",
      icon: Download,
      onClick: handleDownload,
      color: "from-indigo-500 to-purple-600", // Matches purple elements if any, or deep blue
      description: "Download as PDF",
    },
  ];

  return (
    <div className="glass p-6 animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Generated Cover Letter
      </h2>

      <div className="mb-6">
        <div className="text-justify">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={onContentChange}
            modules={modules}
            formats={formats}
            className="custom-scrollbar [&_.ql-editor]:text-justify"
            style={{ minHeight: "300px" }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
          {actionButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <button
                key={index}
                onClick={button.onClick}
                disabled={isLoading}
                className={
                  "group relative p-4 bg-gradient-to-r " +
                  button.color +
                  " text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                }
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{button.label}</span>
                </div>

                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10">
                  {button.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/20 rounded-xl">
        <div className="flex flex-wrap justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Words:</span>{" "}
            {
              content
                .replace(/<[^>]*>/g, " ")
                .split(/\s+/)
                .filter((word) => word.length > 0).length
            }
          </div>
          <div>
            <span className="font-medium">Characters:</span>{" "}
            {content.replace(/<[^>]*>/g, "").length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterDisplay;
