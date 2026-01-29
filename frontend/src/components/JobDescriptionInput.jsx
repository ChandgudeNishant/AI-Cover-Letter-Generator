import React, { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import { extractTextFromPDF } from "../services/api";
import toast from "react-hot-toast";

const JobDescriptionInput = ({ jobDescription, setJobDescription }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file only");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsProcessing(true);
    setUploadedFileName(file.name);

    try {
      const extractedText = await extractTextFromPDF(file);
      setJobDescription(extractedText);
      toast.success("PDF processed successfully!");
    } catch (error) {
      toast.error("Failed to extract text from PDF");
      setUploadedFileName("");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearJobDescription = () => {
    setJobDescription("");
    setUploadedFileName("");
  };

  return (
    <div className="glass p-6 animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <FileText className="w-6 h-6 mr-2 text-primary-500" />
        Job Description
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here or upload a PDF below..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm"
            disabled={isProcessing}
          />
        </div>

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative bg-white px-4 text-sm text-gray-500 rounded-full">
            OR
          </div>
        </div>

        <div
          className={
            "relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 " +
            (isDragging
              ? "border-primary-400 bg-primary-50"
              : "border-gray-300 hover:border-primary-300") +
            (isProcessing ? " opacity-50 pointer-events-none" : "")
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />

          <div className="text-center">
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2"></div>
                <p className="text-sm text-gray-600">Processing PDF...</p>
              </div>
            ) : uploadedFileName ? (
              <div className="flex flex-col items-center">
                <FileText className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-sm text-gray-700 font-medium">
                  {uploadedFileName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF processed successfully
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-primary-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF files only (max 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
