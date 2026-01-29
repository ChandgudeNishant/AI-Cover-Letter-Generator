import React from 'react'
import { Sparkles, FileText } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="glass p-8 text-center animate-slide-up">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <FileText className="w-12 h-12 text-primary-500 animate-pulse-soft" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-800">
            Generating Your Cover Letter
          </h3>
          <p className="text-gray-600">
            AI is crafting the perfect cover letter for you...
          </p>
        </div>
        
        <div className="w-full max-w-xs">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 max-w-md">
          <p className="italic">
            Tip: The more specific your job description and personal details, 
            the better your cover letter will be!
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
