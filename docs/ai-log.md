# AI Collaboration Log

This document records how AI suggestions were evaluated, used, rejected, and verified during development.

## Stack Explanation Prompt

> Explain this proposed technology stack in plain language for a student with no previous web-development experience:
> Next.js App Router, React, TypeScript, Tailwind CSS, accessible HTML, ESLint, Node.js, npm, Git, GitHub, and Vercel.
> Explain what each technology does and how they work together. Do not provide code, terminal commands, installation steps, credentials, or invented results.


## Comparison


Gemini's Response:

This collection of tools forms a complete modern web development toolkit, taking a project from an initial idea on your screen to a live website on the internet.

The Visual Building Blocks

Accessible HTML: The core foundation of any webpage that ensures text, buttons, and images can be understood by everyone, including visitors using assistive technologies like screen readers.

React: A library for building user interfaces by breaking pages down into reusable pieces, like a navigation bar or a submit button, rather than writing every page from scratch.

Next.js App Router: A framework built on top of React that organizes your project folders, determines how pages load, and helps your website load faster for users visiting different sections.

TypeScript: An enhanced version of standard JavaScript that automatically checks your writing for typos and data mistakes before your code ever runs.

Tailwind CSS: A styling system that lets you design web pages directly using quick visual shortcuts for colors, fonts, and layouts without writing massive custom design stylesheets.

The Support and Engine Room

Node.js: A software environment that allows JavaScript to run outside of a standard web browser, powering the background operations of your development tools.

npm: A digital library and package manager that lets you easily download, share, and update the external tools and add-ons your project needs.

ESLint: An automated code-checker that scans your work as you type to catch syntax mistakes and enforce consistent writing rules.

Collaboration and Deployment

Git: A tracking system that records every change you make to your code, allowing you to easily undo mistakes or test new ideas safely.

GitHub: A cloud-based platform where you store your Git project history, back up your work, and share your code with others.

Vercel: A publishing platform that automatically connects to your GitHub repository and launches your project onto the live internet with a real web address.

How They Work Together
You write your webpage pieces using React and Tailwind, organized cleanly through Next.js, while TypeScript and ESLint watch your back to keep your code error-free. Node.js and npm power the development tools running in the background on your computer. When you are ready to save or share your work, Git records your progress, GitHub securely stores it in the cloud, and Vercel automatically turns it into a live website that anyone can visit.

ChatGPT:

This technology stack is a collection of tools used to build, check, organize, and publish a modern website.

HTML provides the basic structure and meaning of a webpage, such as headings, paragraphs, buttons, links, and forms.
Accessible HTML means using HTML in a way that makes the website easier for everyone to use, including people who use screen readers, keyboards, or other assistive technologies.
React helps developers build a website from reusable pieces called components. A navigation bar, product card, or search box can each be created as a component and reused throughout the website.
Next.js is a framework built around React. It provides an organized structure for creating complete websites and includes features for loading pages, handling navigation, and improving performance.
Next.js App Router is the part of Next.js that connects web addresses to pages. It organizes pages and layouts using folders, making it possible to share elements such as headers and menus across multiple pages.
TypeScript helps developers catch mistakes while writing JavaScript-based applications. It keeps track of the kinds of information the program expects, such as text, numbers, or user records.
Tailwind CSS controls the visual appearance of the website. It provides small, ready-made styling options for things such as colors, spacing, text size, borders, and page layouts.
ESLint examines the project’s source files for common mistakes and inconsistent coding practices. It helps keep the code easier to understand and maintain.
Node.js allows JavaScript-based development tools to run on the developer’s computer and can also run parts of the website on a server.
npm manages the software packages the project depends on. It keeps track of tools such as Next.js, React, TypeScript, Tailwind CSS, and ESLint.
Git records changes made to the project over time. It allows developers to review earlier versions, work on changes safely, and combine work from multiple people.
GitHub stores Git projects online. It supports collaboration, code review, issue tracking, and connections to publishing services.
Vercel publishes the finished Next.js website on the internet. It can connect to GitHub and create an updated deployment when approved changes are added to the project.

Together, React provides the reusable interface pieces, while Next.js and its App Router organize them into pages and layouts. Accessible HTML gives those pages meaningful and usable structure, Tailwind CSS controls their appearance, and TypeScript helps prevent programming mistakes. ESLint checks the quality and consistency of the source files. Node.js runs the development tools, while npm manages the packages they require. Git records the project’s history, GitHub stores and supports collaboration on that history, and Vercel turns the project into a website people can visit.

1. ChatGPT explained standard HTML and accessible HTML separately and distinguished Next.js from the Next.js App Router. Gemini combined these concepts into broader descriptions.

2. ChatGPT used a detailed technology-by-technology explanation followed by the complete workflow. Gemini organized the tools into three categories and used informal comparisons such as "engine room" and "watch your back."



## App Shell Architect Prompt

Act as a senior teaching assistant. Propose a minimal Next.js App Router, TypeScript, and Tailwind CSS starter for a neighborhood property platform.

The starter page must contain a main heading, a short explanation of the project's purpose, and three feature cards named Listings, Neighborhood Sponsors, and Voice Help.

Provide a short file plan, terminal commands, accessibility requirements, and a verification checklist. Use ESLint, a src directory, and accessible semantic HTML. Do not provide a giant code dump. Do not add a database, authentication, backend service, or additional libraries. Never invent command results, passwords, credentials, API keys, environment variables, or test results.


## Work Log

| Tool | Prompt | Output used | Output rejected | Verification | Commit |


| ChatGPT | Plain-language stack explanation prompt | Used its separate explanations of HTML, accessibility, Next.js, App Router, Git, GitHub, and the complete development workflow. | Nothing substantial was rejected because the response followed the requested scope. | Confirmed that every required technology was covered and that no code, commands, credentials, or invented results were included. | Document verified setup and AI planning |

| Gemini | Same plain-language stack explanation prompt | Used its three-category organization, beginner-friendly descriptions, and summary of the development workflow. | Rejected the claims that TypeScript and ESLint keep code error-free, that ESLint always scans as the student types, and that Vercel deploys automatically before configuration. | Compared the response against the assignment requirements and confirmed that it did not add a backend, database, authentication system, commands, credentials, or invented results. | Document verified setup and AI planning |

| Google AI Studio | App Shell Architect prompt requesting a file plan, commands, accessibility requirements, and verification checklist | Accepted the basic file plan, semantic HTML requirements, heading hierarchy, responsive layout, and local-page checks. | Rejected the `my-app` destination because it would create a nested project folder, and rejected the multiline Bash formatting because the student is using Windows PowerShell. The corrected destination is the current repository represented by `.`. | Compared the response with the assignment and confirmed that the project must be created in the current repository. Commands were not treated as verified results. | Create minimal Next.js app shell |

| ChatGPT | Step-by-step implementation guidance for the required accessible app shell | Used the semantic `page.tsx` structure, project heading, purpose statement, responsive Tailwind layout, three feature cards, and updated page metadata. | Rejected the generic Next.js starter content and did not add a database, authentication, backend service, secrets, or unnecessary libraries. | Confirmed the local page returned HTTP 200, the browser console had no errors, `npm run lint` passed, and `npm run build` compiled successfully. | Create accessible neighborhood app shell |