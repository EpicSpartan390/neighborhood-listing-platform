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


## Lab 2 Type Interface Prompt

**Tool:** Google AI Studio

**Prompt evidence:** [View prompt screenshot](screenshots/lab2-ai-studio-types-prompt.png)

> I am building a Next.js and TypeScript neighborhood property interface.
>
> Create TypeScript interfaces named Property and Sponsor.
>
> The Property interface must support:
>
> - a stable unique ID
> - address
> - price
> - bedrooms
> - bathrooms
> - square footage
> - property image source
> - descriptive image alt text
> - real property listing URL
>
> The Sponsor interface must support:
>
> - a stable unique ID
> - business name
> - sponsor image source
> - descriptive image alt text
> - business URL
> - an optional short description
>
> Decide which fields must be required for the PropertyCard and SponsorBanner to render meaningful, accessible content. Use optional fields only when the component can still work correctly without that information.
>
> Return TypeScript interfaces only. Do not create React components, sample data, JSX, CSS, explanations, or additional files.

### AI Studio Draft

**Draft evidence:** [View draft screenshot](screenshots/lab2-ai-studio-types-draft.png)

```ts
export interface Property {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  imageSrc: string;
  imageAlt: string;
  listingUrl: string;
}

export interface Sponsor {
  id: string;
  businessName: string;
  imageSrc: string;
  imageAlt: string;
  businessUrl: string;
  description?: string;
}
```

### Review and Verification

- **Output used:** Accepted the `Property` and `Sponsor` interface structure, stable IDs, descriptive image-alt fields, URLs, and optional sponsor description.
- **Output changed:** Renamed `sqft` to `squareFeet` because the complete name is clearer to developers reading the code.
- **Output rejected:** No React components, sample data, JSX, CSS, or extra files were accepted because this step required interfaces only.
- **Accessibility review:** Kept `imageAlt`, `listingUrl`, `businessName`, and `businessUrl` required because the future components need them to provide meaningful images and specifically named links.
- **Verification:** `npm.cmd run lint` completed with no lint errors. `npm.cmd run build` compiled successfully and generated all four static pages.
- **Related commit:** `Define shared Property and Sponsor types`


## Lab 2 PropertyCard Implementation Guidance

**Tool:** ChatGPT

**Request:** Provide beginner-oriented, step-by-step guidance for creating a typed and accessible `PropertyCard` using the existing `Property` interface. The card needed semantic HTML, an address heading, price, property facts, descriptive image alt text, a specifically labeled listing link, responsive styling, and visible keyboard focus.

### Review and Verification

- **Output used:** Used a typed `property` prop, semantic `<article>`, associated address heading, Next.js image component, formatted price, property-facts list, descriptive listing link, responsive image sizing, and `focus-visible` styles.
- **Output reviewed:** Confirmed that the link names the specific property and that the article is associated with its heading through `aria-labelledby`.
- **Output rejected or deferred:** Did not add extra libraries, database features, authentication, a generic “Click here” label, or unverified accessibility claims. Manual browser and keyboard testing remains deferred until the card is rendered with sample data.
- **Verification:** `Get-Content` confirmed the saved source. `npm.cmd run lint` completed with no errors or warnings. `npm.cmd run build` compiled successfully and generated static pages.
- **Related commit:** `Create accessible PropertyCard component`


## Lab 2 SponsorBanner Implementation Guidance

**Tool:** ChatGPT

**Request:** Provide beginner-oriented, step-by-step guidance for creating a typed and accessible `SponsorBanner` using the existing `Sponsor` interface. The banner needed a visible sponsored label, descriptive image alt text, an identifiable business link, responsive styling, and keyboard focus visibility.

### Review and Verification

- **Output used:** Used a typed `sponsor` prop, semantic `<aside>`, visible `Sponsored` label, associated business heading, Next.js image component, optional description handling, specifically named business link, responsive layout, and `focus-visible` styles.
- **Output reviewed:** Confirmed that sponsored content is visibly identified and that the link’s accessible name includes the business name.
- **Output rejected or deferred:** Did not add extra libraries, hidden sponsorship labeling, generic link text, database features, or unverified compliance claims. Manual browser and keyboard testing remains deferred until the banner is rendered with sponsor data.
- **Verification:** `Get-Content` confirmed the saved source. `npm.cmd run lint` completed with no errors or warnings. `npm.cmd run build` compiled successfully and generated static pages.
- **Related commit:** `Create accessible SponsorBanner component`


## Lab 2 SearchFilters Implementation Guidance

**Tool:** ChatGPT

**Request:** Provide beginner-oriented, step-by-step guidance for creating a typed and accessible `SearchFilters` form with visible labels, select controls, a submit button, custom error messaging, responsive styling, keyboard focus visibility, and an optional typed search callback.

### Review and Verification

- **Output used:** Used a semantic `<form>`, visible labels connected with `htmlFor` and `id`, four select controls, a submit button, typed filter values, optional `onSearch` callback, responsive grid, and visible `focus-visible` styles.
- **Output reviewed:** Confirmed that the instructional select option does not replace the visible label and that the submit button remains keyboard operable.
- **Accessibility behavior:** Added `aria-invalid`, `aria-describedby`, and `role="alert"` for the missing-neighborhood error. Added `role="status"` for successful submission feedback.
- **Output rejected or deferred:** Did not add external form libraries, placeholder-only labels, mouse-only controls, or claims of completed keyboard testing. Manual testing remains deferred until the form is rendered.
- **Verification:** `Get-Content` confirmed the saved source. `npm.cmd run lint` completed with no errors or warnings. `npm.cmd run build` compiled successfully and generated static pages.
- **Related commit:** `Create accessible SearchFilters component`


## Lab 2 Property Data Extraction and Demo Assets

**Tool:** ChatGPT with web access

**Request:** Extract the address, price, bedroom count, total bathroom count, square footage, and source URL from the three instructor-provided Realtor.com listings. Do not invent missing values or treat publicly visible listing photographs as permission to republish them.

### Review and Verification

- **Output used:** Used the verified address, price, bedroom count, total bathroom count, square footage, and original Realtor.com URL for each property.
- **Source date:** Listing values were checked on October 6, 2026. The source URLs are stored in `src/data/properties.ts` because live listing information may change.
- **Output excluded:** Excluded agent information, mortgage estimates, listing descriptions, unrelated page content, and Realtor.com photographs.
- **Image decision:** Created an original local property-placeholder SVG instead of copying listing photographs without explicit reuse permission.
- **Sponsor decision:** Created two clearly identified fictional demo sponsors and two original SVG illustrations because the promised sponsor assets were not provided.
- **Accessibility review:** Wrote honest image-alt descriptions that identify each asset as an illustration and do not claim to depict the actual properties or real sponsor relationships.
- **Verification:** Reviewed the extracted values against the instructor-provided pages. `npm.cmd run lint` completed with no errors or warnings. `npm.cmd run build` compiled successfully.
- **Related commit:** `Add verified sample data and original illustrations`


## Lab 2 Integration and Manual Test Guidance

**Tool:** ChatGPT

**Request:** Connect the reusable SearchFilters, PropertyCard, and SponsorBanner components to the homepage; apply working property filters; render sample data with stable keys; use one, two, and three-column responsive layouts; and provide beginner-oriented manual test instructions.

### Review and Verification

- **Output used:** Connected typed property and sponsor data to reusable components, added working search filtering, added live result feedback, and added a no-results status message.
- **Responsive implementation:** Used `md:grid-cols-2` and `lg:grid-cols-3` for the property grid. Verified layouts at 375 px, 768 px, and 1280 px.
- **Semantic correction:** Changed property and sponsor titles to `<h3>` beneath their section `<h2>` headings.
- **Interactive correction:** Added a Favorite button with `onClick`, `aria-pressed`, a dynamic accessible name, and visible focus styling. Added a property-specific accessible name to the listing link.
- **Form verification:** Confirmed the missing-neighborhood error and a valid price-filter search.
- **Keyboard verification:** Confirmed the complete Tab order, reverse Shift+Tab navigation, Space activation of the Favorite button, Enter activation of the listing link, and visible focus rings.
- **Evidence:** Manual results are recorded in `docs/accessibility-test-notes.md`, with screenshots in `docs/screenshots`.
- **Automated verification:** `npm.cmd run lint` completed with no errors or warnings.
- **Output still pending:** Lighthouse testing and the formal ChatGPT and Gemini critiques have not yet been completed.
- **Related commit:** `Integrate responsive listings and document manual tests`
