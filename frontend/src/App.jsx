import React, { useState } from "react";
import Header from "./components/Header";
import JobDescriptionInput from "./components/JobDescriptionInput";
import PersonalDetailsForm from "./components/PersonalDetailsForm";
import CoverLetterDisplay from "./components/CoverLetterDisplay";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorDisplay from "./components/ErrorDisplay";
import {
  generateCoverLetter,
  rephraseCoverLetter,
  grammarCheckCoverLetter,
} from "./services/api";
import toast from "react-hot-toast";
import coverLetterBg from "./assets/cover-letter-bg.png";

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    currentCompany: "",
    education: "",
    experience: "",
    tone: "professional",
  });
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!jobDescription.trim()) {
        toast.error("Please provide a job description");
        return;
      }
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (
      !userDetails.name.trim() ||
      !userDetails.email.trim() ||
      !userDetails.education.trim()
    ) {
      toast.error(
        "Please fill in all required fields (Name, Email, Education)",
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateCoverLetter(jobDescription, userDetails);
      setCoverLetter(response.coverLetter);
      toast.success("Cover letter generated successfully!");
      setCurrentStep(3);
    } catch (err) {
      setError(err.message || "Failed to generate cover letter");
      toast.error("Failed to generate cover letter");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRephrase = async () => {
    if (!coverLetter.trim()) return;

    setIsLoading(true);
    try {
      const response = await rephraseCoverLetter(coverLetter, userDetails.tone);
      setCoverLetter(response.content);
      toast.success("Cover letter rephrased successfully!");
    } catch (err) {
      toast.error("Failed to rephrase cover letter");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrammarCheck = async () => {
    if (!coverLetter.trim()) return;

    setIsLoading(true);
    try {
      const response = await grammarCheckCoverLetter(coverLetter);
      setCoverLetter(response.content);
      toast.success("Grammar check completed!");
    } catch (err) {
      toast.error("Failed to check grammar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setCoverLetter("");
    setCurrentStep(1);
    // Optional: Reset other states if desired, but user might want to keep them
  };

  const handleRegenerate = () => {
    // Regenerate logic reusing current state
    // Actually we just call generate again, but we are already in step 3.
    // Reuse logic or just call generate.
    setIsLoading(true);
    setError(null);
    generateCoverLetter(jobDescription, userDetails)
      .then((response) => {
        setCoverLetter(response.coverLetter);
        toast.success("Cover letter regenerated!");
      })
      .catch((err) => {
        setError(err.message);
        toast.error("Failed to regenerate");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${coverLetterBg})` }}
    >
      <div className="container mx-auto px-4 py-8">
        <Header />

        <div className="max-w-4xl mx-auto">
          {/* Step Indicators (Optional visual cue) */}
          <div className="flex justify-center items-center mb-8">
            <div
              className={`flex items-center ${currentStep >= 1 ? "text-gray-800" : "text-gray-500"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? "bg-gray-600 text-white border-gray-600" : "border-gray-400 text-gray-500"}`}
              >
                1
              </div>
              <span className="ml-2 font-medium">Job Details</span>
            </div>
            <div
              className={`w-12 h-1 mx-4 ${currentStep >= 2 ? "bg-gray-600" : "bg-gray-300"}`}
            ></div>
            <div
              className={`flex items-center ${currentStep >= 2 ? "text-gray-800" : "text-gray-500"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? "bg-gray-600 text-white border-gray-600" : "border-gray-400 text-gray-500"}`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Your Info</span>
            </div>
            <div
              className={`w-12 h-1 mx-4 ${currentStep >= 3 ? "bg-gray-600" : "bg-gray-300"}`}
            ></div>
            <div
              className={`flex items-center ${currentStep >= 3 ? "text-gray-800" : "text-gray-500"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 3 ? "bg-gray-600 text-white border-gray-600" : "border-gray-400 text-gray-500"}`}
              >
                3
              </div>
              <span className="ml-2 font-medium">Result</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
            {currentStep === 1 && (
              <div className="space-y-6">
                <JobDescriptionInput
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                />
                <button
                  onClick={handleNextStep}
                  className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  Next ➜
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <PersonalDetailsForm
                  userDetails={userDetails}
                  setUserDetails={setUserDetails}
                />
                <div className="flex gap-4">
                  <button
                    onClick={handlePrevStep}
                    className="w-1/3 py-4 px-6 bg-gradient-to-r from-gray-500 to-slate-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-2/3 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? "Generating..." : "Generate ⚡"}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                {isLoading && <LoadingSpinner />}
                {error && (
                  <ErrorDisplay message={error} onRetry={handleRegenerate} />
                )}
                {coverLetter && !isLoading && (
                  <>
                    <CoverLetterDisplay
                      content={coverLetter}
                      onContentChange={setCoverLetter}
                      onRephrase={handleRephrase}
                      onGrammarCheck={handleGrammarCheck}
                      onRegenerate={handleRegenerate}
                      userDetails={userDetails}
                      isLoading={isLoading}
                    />
                    <button
                      onClick={handleStartOver}
                      className="mt-4 w-full py-3 px-6 bg-gradient-to-r from-gray-500 to-slate-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                    >
                      ⟲ Reset
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
