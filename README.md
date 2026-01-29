# AI Cover Letter Generator

A comprehensive full-stack application that generates professional cover letters using **Llama 3.3 AI via Groq**. Built with React.js frontend and Express.js backend, featuring a beautiful glassmorphism design.

## Features

### 🧠 Advanced AI Power

- **State-of-the-Art AI**: Leverages the **Llama 3.3-70b-versatile** model via Groq for high-quality, human-like text generation.
- **Intelligent Context Understanding**: Analyzes both your profile and the specific job description to create highly tailored content.
- **Smart Rephrasing**: rewriting engine that can adjust the phrasing of specific sections while preserving the original meaning.
- **AI Grammar & Polish**: Automated proofreading system that ensures your cover letter is error-free and professionally polished.

### 🚀 Core Functionality

- **PDF Job Analysis**: Simply upload a PDF of the job description; the system extracts the text and understands the requirements automatically.
- **Rich Text Editing**: Full-featured built-in editor allowing you to fine-tune the AI-generated content before exporting.
- **Professional PDF Export**: One-click download of your properly formatted cover letter as a PDF.

### 🎨 Customization Options

- **5 Distinct Tones**:
  - **Formal**: Traditional business letter structure.
  - **Professional**: Balanced, approachable, and respectful.
  - **Educational**: Focuses on learning, growth, and academic milestones.
  - **Casual**: Modern, conversational, yet respectful.
  - **Enthusiastic**: Highlights passion and excitement for the role.

### ✨ User Experience

- **Glassmorphism UI**: Stunning modern interface with transparent elements and blurs.
- **Real-time Feedback**: Instant validation and friendly error messages.
- **Responsive Design**: Flawless experience across mobile, tablet, and desktop devices.
- **One-Click Actions**: Copy to clipboard, regenerate, or download instantly.

## Tech Stack

### Frontend

- **React.js** - Component-based UI library
- **TailwindCSS** - Utility-first styling including `backdrop-blur` for glassmorphism
- **React Quill** - Powerful rich text editor
- **jsPDF** - Client-side PDF generation
- **Lucide React** - Modern, crisp icons
- **Vite** - Lightning-fast build tooling

### Backend

- **Node.js & Express** - Robust server-side runtime
- **Groq SDK** - Ultra-fast inference for Llama 3.3 models
- **Multer** - Secure file upload handling
- **PDF-Parse** - Server-side PDF text extraction
- **Helmet & Rate Limit** - Enterprise-grade security and API protection
- **Express Validator** - Strict input validation

## Project Structure

```
ai-cover-letter-generator/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/      # UI Components
│   │   │   ├── Header.jsx
│   │   │   ├── JobDescriptionInput.jsx
│   │   │   ├── PersonalDetailsForm.jsx
│   │   │   ├── CoverLetterDisplay.jsx
│   │   │   └── ...
│   │   ├── services/        # API Integration
│   │   └── utils/           # Helpers (PDF generation, etc.)
│   └── ...
├── backend/                  # Express.js backend
│   ├── server.js            # Main application logic & AI integration
│   └── ...
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- **Groq API Key** (Get one at [console.groq.com](https://console.groq.com))

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-cover-letter-generator
npm run install:all
```

### 2. Environment Setup

#### Backend Environment

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment (Optional)

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Start Development Servers

```bash
npm run dev
```

This command concurrently starts the frontend (http://localhost:5173) and backend (http://localhost:5000).

## API Endpoints

### POST /api/generate-cover-letter

Generates the cover letter.

- **Body**: `{ jobDescription, userDetails: { name, email, education, tone, ... } }`

### POST /api/extract-pdf

Extracts text from an uploaded job description PDF.

- **Body**: Multipart form-data with `pdf` file.

### POST /api/rephrase

Rephrases specific content.

- **Body**: `{ content, tone }`

### POST /api/grammar-check

Corrects grammar and spelling.

- **Body**: `{ content }`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Groq** for providing ultra-fast inference API.
- **Meta** for the Llama 3.3 model.
- **React & Express Communities** for the robust ecosystem.
