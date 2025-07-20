# AI-eph

> Your AI-powered writing co-pilot.

AI-eph is a web application designed for novelists and world-builders. Unlike traditional text editors, AI-eph is more than just a place to write; it acts as an intelligent assistant that reads, understands, and analyzes your work to help you maintain consistency, track characters, and detect contradictions.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🚀 About The Project

Writers of long-form fiction often struggle with consistency. In which chapter did this character last appear? What was their eye color in the first book? Does this new plot point contradict something established earlier?

AI-eph was born to solve this problem, acting as the memory and analyst for your fictional universe.

---

## ✨ Key Features

### 📚 **Novel Management System**
* **Novel Dashboard:** Create, edit, and manage multiple novels with detailed metadata
* **Genre Selection:** Comprehensive autocomplete with 70+ literary genres
* **Novel Statistics:** Track word count, reading time, and chapter progress
* **Status Management:** Draft, published, and archived novel states

### 📖 **Advanced Chapter Editor**
* **Three-Panel Layout:** Optimized writing experience with dedicated spaces for content, notes, and AI suggestions
* **Rich Text Editor:** Full-featured TipTap editor with formatting, images, and advanced features
* **Auto-Generated Summaries:** AI-powered chapter summaries with one-click generation
* **Author Notes:** Personal annotations and writing notes for each chapter
* **Real-time Statistics:** Live word count and reading time calculations

### 🤖 **AI-Powered Features**
* **Smart Suggestions:** Context-aware writing suggestions and improvements
* **Character Tracking:** Automatically identify and track character appearances
* **Consistency Analysis:** Detect potential plot contradictions and inconsistencies
* **Writing Assistance:** Real-time feedback and writing tips

### 🌐 **Internationalization**
* **Bilingual Support:** Complete English and Spanish localization
* **Dynamic Language Switching:** Change languages without page reloads
* **Comprehensive Translation:** 300+ translation keys covering all UI elements
* **Editor Localization:** Fully translated TipTap editor components and toolbars

### 🔐 **Security & Performance**
* **Secure Authentication:** Supabase-powered user management
* **Server-Side Rendering:** Optimized performance with Next.js App Router
* **Modern Architecture:** Clean separation between server and client components
* **Responsive Design:** Works seamlessly on desktop and mobile devices

---

## 🛠️ Tech Stack

This project is built with a modern, performance-focused tech stack:

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router with Server Components)
* **Language:** [TypeScript](https://www.typescriptlang.org/) with strict type checking
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom design system
* **Component Library:** [Shadcn/ui](https://ui.shadcn.com/) for consistent UI
* **Text Editor:** [TipTap](https://tiptap.dev/) for rich text editing
* **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/) for bilingual support
* **Backend & Database:** [Supabase](https://supabase.com/) (Auth, PostgreSQL, Real-time)
* **AI Integration:** [Google AI (Gemini)](https://ai.google.dev/) for intelligent features
* **Deployment:** [Vercel](https://vercel.com/) for seamless deployment

---

## 🏗️ Architecture

### **Modern React Patterns**
* **Server Components:** Data fetching and rendering on the server
* **Client Components:** Interactive features and state management
* **Type Safety:** Full TypeScript integration with Supabase types
* **Component Reusability:** Shared components for create/edit operations

### **Database Schema**
* **Novels:** Title, description, genre, status, metadata
* **Chapters:** Content, summary, author notes, statistics, ordering
* **User Management:** Secure authentication and authorization
* **Real-time Features:** Live collaboration and updates

---

## ⚙️ Getting Started

Follow these steps to get the project running on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Khadosh/AI-eph.git](https://github.com/Khadosh/AI-eph.git)
    cd AI-eph
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the project root and add your Supabase and Google AI keys.
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    GOOGLE_AI_API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```

    **Note:** The application includes built-in internationalization. The default language is Spanish, but users can switch to English through the UI language selector.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🗺️ Roadmap

### **Completed Features** ✅
* [x] Initial project setup (Next.js, TS, Tailwind)
* [x] Shadcn/ui integration and design system
* [x] Authentication system with Supabase
* [x] Database schema for novels and chapters
* [x] Novel management dashboard (CRUD operations)
* [x] Advanced chapter editor with three-panel layout
* [x] Rich text editor with TipTap integration
* [x] Genre selection with autocomplete
* [x] Real-time statistics and word counting
* [x] Modern architecture with Server/Client components

### **Recently Completed** ✅
* [x] **Complete Internationalization (i18n)** - Full bilingual support (English/Spanish)
  * Dynamic language switching without page reloads
  * 300+ translation keys covering all UI elements
  * Tiptap editor components fully internationalized
  * Centralized status and label translation system
* [x] **Next.js 15 Compatibility** - Full upgrade to latest Next.js version
  * Async params handling for dynamic routes
  * Server/Client component optimization
  * Enhanced type safety and error handling

### **In Development** 🚧
* [ ] AI-powered summary generation
* [ ] Character tracking and analysis
* [ ] Contradiction detection system
* [ ] Advanced AI suggestions
* [ ] Collaborative writing features

### **Future Features** 🔮
* [ ] **Phase 2:** Advanced AI analysis and character profiles
* [ ] **Phase 3:** Timeline visualization and plot tracking
* [ ] **Phase 4:** Publishing and sharing capabilities
* [ ] **Phase 5:** Mobile app and offline support

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.