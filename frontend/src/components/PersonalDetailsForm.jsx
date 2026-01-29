import React from "react";
import {
  User,
  Mail,
  Building,
  GraduationCap,
  Clock,
  MessageSquare,
} from "lucide-react";

const PersonalDetailsForm = ({ userDetails, setUserDetails }) => {
  const handleInputChange = (field, value) => {
    setUserDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toneOptions = [
    {
      value: "formal",
      label: "Formal 👔",
      description: "Traditional business letter style",
    },
    {
      value: "professional",
      label: "Professional 💼",
      description: "Balanced and approachable",
    },
    {
      value: "educational",
      label: "Educational 🎓",
      description: "Emphasizes learning and growth",
    },
    {
      value: "casual",
      label: "Casual 😎",
      description: "Conversational yet respectful",
    },
    {
      value: "enthusiastic",
      label: "Enthusiastic 🎯",
      description: "Shows excitement and passion",
    },
  ];

  return (
    <div className="glass p-6 animate-slide-up">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <User className="w-6 h-6 mr-2 text-primary-500" />
        Personal Details
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            value={userDetails.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter your full name"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email address"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4 inline mr-1" />
            Current Company/Designation
          </label>
          <input
            type="text"
            value={userDetails.currentCompany}
            onChange={(e) =>
              handleInputChange("currentCompany", e.target.value)
            }
            placeholder="e.g., Software Engineer at ABC Corp"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <GraduationCap className="w-4 h-4 inline mr-1" />
            Education *
          </label>
          <textarea
            value={userDetails.education}
            onChange={(e) => handleInputChange("education", e.target.value)}
            placeholder="e.g., Bachelor's in Computer Science from XYZ University (2020)"
            className="w-full h-20 p-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Years of Experience
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={userDetails.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            placeholder="e.g., 3"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-300 bg-white/50 backdrop-blur-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            Tone of Voice
          </label>
          <div className="grid grid-cols-1 gap-3">
            {toneOptions.map((tone) => (
              <label
                key={tone.value}
                className={
                  "flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 " +
                  (userDetails.tone === tone.value
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-primary-300 bg-white/30")
                }
              >
                <input
                  type="radio"
                  name="tone"
                  value={tone.value}
                  checked={userDetails.tone === tone.value}
                  onChange={(e) => handleInputChange("tone", e.target.value)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{tone.label}</div>
                  <div className="text-sm text-gray-600">
                    {tone.description}
                  </div>
                </div>
                <div
                  className={
                    "w-4 h-4 rounded-full border-2 " +
                    (userDetails.tone === tone.value
                      ? "border-primary-500 bg-primary-500"
                      : "border-gray-300")
                  }
                >
                  {userDetails.tone === tone.value && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">* Required fields</div>
    </div>
  );
};

export default PersonalDetailsForm;
