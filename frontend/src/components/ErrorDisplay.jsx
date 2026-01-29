import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div className="glass p-8 text-center animate-slide-up border-red-200">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-red-800">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 max-w-md">
            {message || 'An unexpected error occurred. Please try again.'}
          </p>
        </div>
        
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        
        <div className="text-sm text-gray-500 max-w-md space-y-1">
          <p>If the problem persists, please check:</p>
          <ul className="text-left list-disc list-inside space-y-1 text-xs">
            <li>Your internet connection</li>
            <li>That all required fields are filled</li>
            <li>That your job description is not empty</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ErrorDisplay
