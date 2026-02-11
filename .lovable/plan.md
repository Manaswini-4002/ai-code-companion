

# AI-Powered Code Review & Rewrite Agent

## Overview
A full-featured web application where users can paste or upload code, and an AI agent analyzes it for bugs, security vulnerabilities, performance issues, and style — then offers rewritten/refactored versions. Users sign up to save their review history.

---

## Pages & Features

### 1. Landing Page
- Hero section with a compelling headline and animated code visualization
- Feature highlights: Code Review, Rewriting, Security Analysis, Multi-language Support
- Language icons (Python, JavaScript, Java, C++, TypeScript, etc.)
- Call-to-action buttons to sign up or try a demo

### 2. Authentication
- Sign up / Log in with email and password
- User profile with review history

### 3. Code Review Dashboard (Main App)
- **Code Input Area**: Large code editor/textarea where users paste their code
- **Language Selector**: Dropdown to pick the programming language (Python, JavaScript, Java, C++, TypeScript, Go, etc.)
- **Review Type Selector**: Choose what to analyze — Code Quality, Security, Performance, or All
- **Submit for Review** button

### 4. Review Results Page
- **Summary Card**: Overall score/grade with quick stats (issues found, severity breakdown)
- **Inline Annotations**: The original code displayed with highlighted issues — bugs in red, warnings in yellow, suggestions in blue
- **Detailed Findings List**: Each issue with severity level, description, and suggested fix
- **Security Report**: Dedicated section for security vulnerabilities with severity ratings
- **Rewritten Code**: A side-by-side or tabbed view showing the AI's improved version of the code
- **Copy / Download** buttons for the rewritten code

### 5. Review History
- List of past reviews with date, language, and summary score
- Click to revisit any previous review in detail

---

## Backend (Lovable Cloud + Supabase)

- **User Authentication**: Email/password sign-up and login
- **Database**: Store user profiles, review history, and results
- **Edge Function**: Sends code to Lovable AI for analysis and streams back results
- **AI Integration**: Uses Lovable AI gateway for code review, security analysis, and rewriting

---

## Design & Style
- Clean, modern dark theme with blue and neon accent colors
- Futuristic feel with subtle glowing elements and smooth animations
- Monospace font for code areas, clean sans-serif for UI text
- Responsive design for desktop and tablet use

