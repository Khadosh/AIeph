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

* **Chapter-Based Editor:** A clean, focused interface to let you write without distractions.
* **Secure Authentication:** Manage your work privately and securely with a user account system.
* **Personal Dashboard:** Access all your writings and projects from a single, organized space.
* **AI-Powered Analysis (In Development):**
    * **Character Profiles:** Automatically generate a profile for each character, detailing their descriptions and appearances.
    * **Timelines:** Visualize the key events in your story.
    * **Contradiction Detector:** Get alerted to potential inconsistencies in your plot, descriptions, or dialogue.

---

## 🛠️ Tech Stack

This project is built with a modern, performance-focused tech stack:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Component Library:** [Shadcn/ui](https://ui.shadcn.com/)
* **Backend & Database:** [Supabase](https://supabase.com/) (Auth, PostgreSQL with `pgvector`, Storage)
* **AI:** [Google AI (Gemini)](https://ai.google.dev/)
* **Deployment:** [Vercel](https://vercel.com/)

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

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🗺️ Roadmap

The road ahead for AI-eph:

* [x] Initial project setup (Next.js, TS, Tailwind).
* [x] Shadcn/ui integration.
* [x] Authentication system with Supabase.
* [ ] Database schema for users and writings.
* [ ] User dashboard to list and create new writings.
* [ ] Functional text editor.
* [ ] **Phase 2:** AI integration for text analysis.
* [ ] **Phase 3:** Contradiction detector implementation with embeddings.

---

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.