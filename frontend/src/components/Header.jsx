import React from "react";
import logo from "../assets/logo.png";

const Header = () => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <div className="glass p-12 max-w-1xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div>
            <img src={logo} alt="Logo" className="w-58 h-52 object-contain" />
          </div>
        </div>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Create professional, personalized cover letters in minutes using the
          power of AI. Simply input your details and job description to get
          started.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-md text-gray-600">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2"></div>📤 PDF Upload
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-2"></div>☰ Multiple Tones
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-2"></div>
            📃 Instant PDF Download
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
