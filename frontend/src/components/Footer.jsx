import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-12 pb-8 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <a
              href="https://github.com/ChandgudeNishant/AI-Cover-Letter-Generator"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-gray-900/50 transform hover:-translate-y-0.5"
            >
              <Github className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold">View Source Code</span>
            </a>

            <div className="flex items-center gap-6">
              <a
                href="https://www.linkedin.com/in/nishant-chandgude-5b01ab21b"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 bg-white/50 px-4 py-2 rounded-lg hover:bg-white/80"
              >
                <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium hidden sm:block">LinkedIn</span>
              </a>

              <a
                href="mailto:chandgudenishant@gmail.com"
                className="group flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors duration-300 bg-white/50 px-4 py-2 rounded-lg hover:bg-white/80"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium hidden sm:block">Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
