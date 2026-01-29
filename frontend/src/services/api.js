const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.error ||
      (errorData.errors && errorData.errors.map((e) => e.msg).join(", ")) ||
      `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

export const extractTextFromPDF = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const response = await fetch(`${API_BASE_URL}/extract-pdf`, {
      method: "POST",
      body: formData,
    });

    const data = await handleResponse(response);
    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(
      "Failed to extract text from PDF. Please ensure the PDF contains selectable text.",
    );
  }
};

export const generateCoverLetter = async (jobDescription, userDetails) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-cover-letter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobDescription: jobDescription.trim(),
        userDetails: {
          ...userDetails,
          name: userDetails.name.trim(),
          email: userDetails.email.trim(),
          education: userDetails.education.trim(),
        },
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Cover letter generation error:", error);
    throw new Error(
      error.message || "Failed to generate cover letter. Please try again.",
    );
  }
};

export const rephraseCoverLetter = async (content, tone = "professional") => {
  try {
    const response = await fetch(`${API_BASE_URL}/rephrase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content.trim(),
        tone,
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Rephrase error:", error);
    throw new Error(
      error.message || "Failed to rephrase content. Please try again.",
    );
  }
};

export const grammarCheckCoverLetter = async (content) => {
  try {
    const response = await fetch(`${API_BASE_URL}/grammar-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content.trim(),
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Grammar check error:", error);
    throw new Error(
      error.message || "Failed to check grammar. Please try again.",
    );
  }
};

export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Health check error:", error);
    throw new Error("API is not responding");
  }
};
