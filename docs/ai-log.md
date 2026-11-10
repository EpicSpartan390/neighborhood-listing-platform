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
ESLint examines the project's source files for common mistakes and inconsistent coding practices. It helps keep the code easier to understand and maintain.
Node.js allows JavaScript-based development tools to run on the developer's computer and can also run parts of the website on a server.
npm manages the software packages the project depends on. It keeps track of tools such as Next.js, React, TypeScript, Tailwind CSS, and ESLint.
Git records changes made to the project over time. It allows developers to review earlier versions, work on changes safely, and combine work from multiple people.
GitHub stores Git projects online. It supports collaboration, code review, issue tracking, and connections to publishing services.
Vercel publishes the finished Next.js website on the internet. It can connect to GitHub and create an updated deployment when approved changes are added to the project.

Together, React provides the reusable interface pieces, while Next.js and its App Router organize them into pages and layouts. Accessible HTML gives those pages meaningful and usable structure, Tailwind CSS controls their appearance, and TypeScript helps prevent programming mistakes. ESLint checks the quality and consistency of the source files. Node.js runs the development tools, while npm manages the packages they require. Git records the project's history, GitHub stores and supports collaboration on that history, and Vercel turns the project into a website people can visit.

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
- **Output rejected or deferred:** Did not add extra libraries, database features, authentication, a generic "Click here" label, or unverified accessibility claims. Manual browser and keyboard testing remains deferred until the card is rendered with sample data.
- **Verification:** `Get-Content` confirmed the saved source. `npm.cmd run lint` completed with no errors or warnings. `npm.cmd run build` compiled successfully and generated static pages.
- **Related commit:** `Create accessible PropertyCard component`


## Lab 2 SponsorBanner Implementation Guidance

**Tool:** ChatGPT

**Request:** Provide beginner-oriented, step-by-step guidance for creating a typed and accessible `SponsorBanner` using the existing `Sponsor` interface. The banner needed a visible sponsored label, descriptive image alt text, an identifiable business link, responsive styling, and keyboard focus visibility.

### Review and Verification

- **Output used:** Used a typed `sponsor` prop, semantic `<aside>`, visible `Sponsored` label, associated business heading, Next.js image component, optional description handling, specifically named business link, responsive layout, and `focus-visible` styles.
- **Output reviewed:** Confirmed that sponsored content is visibly identified and that the link's accessible name includes the business name.
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

## Lab 2 ChatGPT PropertyCard Critique

**Tool:** ChatGPT

**Prompt evidence:** [View ChatGPT critique prompt](screenshots/lab2-chatgpt-critique-prompt.png)

**Response evidence:** [View ChatGPT critique response](screenshots/lab2-chatgpt-critique-response.png)

### Prompt

> Review my current `src/components/PropertyCard.tsx` implementation from this conversation for semantic HTML, WCAG-oriented keyboard access, responsive behavior, and TypeScript safety.
>
> Return:
>
> 1. confirmed strengths,
> 2. issue,
> 3. why it matters,
> 4. smallest recommended change,
> 5. a manual test for each recommendation.
>
> Check the article landmark, heading hierarchy, dynamic image alternative text, Favorite button state and accessible name, listing-link accessible name, keyboard focus classes, responsive classes, and typed Property prop.
>
> Treat the implementation as an AI-generated draft. Do not claim WCAG compliance from code alone. Distinguish actual code issues from items that require browser or assistive-technology testing. Do not add libraries, backend services, authentication, or unrelated features.

### Critique Results

**Confirmed strengths:**

- The property card uses an `<article>` semantic root with `aria-labelledby`.
- The property address uses an `<h3>`, which fits beneath the page section's `<h2>`.
- The image alternative text is built dynamically from typed property data.
- The Favorite control is a native `<button>` with `type="button"`, an `onClick` handler, `aria-pressed`, and a property-specific accessible name.
- The listing is a native link with an accessible name that identifies the property.
- Both interactive controls include visible `focus-visible` ring classes.
- The component receives a typed `Property` prop.
- The image and control layout includes responsive classes.

**Issue identified:**

The component created the image alternative with the property address followed by `property.imageAlt`, but the original `imageAlt` data also contained part of the address. This could cause a screen reader to announce repetitive information.

**Why it matters:**

Alternative text should communicate the image's purpose concisely. Repeating the property address makes the announcement longer without adding useful information.

**Smallest recommended change:**

Keep the dynamic address interpolation in `PropertyCard.tsx`, but change each data-level `imageAlt` value so that it describes only the illustration.

**Recommended manual test:**

Inspect the rendered `<img>` element in the browser and confirm that its final `alt` value contains the property address once followed by a useful visual description.

### Evaluation and Verification

- **Output used:** Accepted the recommendation to simplify the three `imageAlt` data values while retaining the dynamically interpolated property address.
- **Output changed:** Each property now uses the visual description `Illustrated placeholder showing a white house with a green roof, trees, and a sun`.
- **Output deferred:** A configurable heading-level prop was not added because `<h3>` is correct in the current page hierarchy. It would be reconsidered only if the component is reused under a different document outline.
- **Output rejected:** No libraries, persistent Favorite storage, backend services, authentication, or unrelated features were added.
- **Lint verification:** `npm.cmd run lint` completed with no errors.
- **Browser verification:** The first rendered image contained the following value:

`alt="1221 Minorca Dr, Pacific Palisades, CA 90272: Illustrated placeholder showing a white house with a green roof, trees, and a sun"`

The property address appeared once, followed by the visual description. This recommendation was verified in the browser. The critique was not treated as proof of complete WCAG compliance.

**Related commit:** `Apply verified ChatGPT accessibility critique`

## Lab 2 Gemini PropertyCard Critique

**Tool:** Gemini

**Prompt evidence:** [View Gemini critique prompt](screenshots/lab2-gemini-critique-prompt.png)

**Response evidence:**

- [View Gemini critique response, part 1](screenshots/lab2-gemini-critique-response.png)
- [View Gemini critique response, part 2](screenshots/lab2-gemini-critique-response-2.png)

### Prompt

> Review the React TypeScript PropertyCard component that I will paste below.
>
> Focus specifically on:
>
> - semantic HTML and the article landmark
> - heading hierarchy
> - image alternative text
> - keyboard access
> - the Favorite button's visible text, accessible name, and aria-pressed state
> - the property listing link's accessible name
> - visible focus styles
> - responsive behavior
> - TypeScript prop safety
>
> For every recommendation, return:
>
> 1. issue,
> 2. why it matters,
> 3. smallest recommended change,
> 4. manual browser or assistive-technology test.
>
> Separate confirmed code strengths from actual code problems and items that require manual testing. Treat this as an AI-generated draft. Do not claim WCAG compliance from source code alone. Do not recommend new libraries, authentication, backend services, databases, or unrelated features.

### Critique Results

**Confirmed strengths:**

- The component uses an `<article>` associated with its heading through `aria-labelledby`.
- Native `<button>` and `<a>` elements provide built-in keyboard behavior.
- Interactive controls include visible `focus-visible` ring classes.
- Next.js `Image`, responsive `sizes`, and Tailwind layout classes support responsive rendering.
- `Intl.NumberFormat` formats the property price.

**Issue accepted:**

Gemini identified that the Favorite button's original accessible names did not contain the complete visible labels. The visible text was `Save property` or `Saved`, while the original `aria-label` began with `Add` or `Remove`.

**Why it matters:**

Speech-control users may try to activate a control by saying its visible label. Including the visible label in the accessible name makes the visible and programmatic labels agree.

**Smallest implemented change:**

The underlying recommendation was accepted, but its suggested implementation was adapted. The property-specific `aria-label` was retained and changed so it begins with the visible button text:

- `Save property: add [address] to favorites`
- `Saved: remove [address] from favorites`

This preserved the visible `Saved` state, property-specific context, and `aria-pressed` behavior.

### Suggestions Rejected or Deferred

**Removing the listing-link accessible name was rejected.**

Gemini suggested relying only on the visible text `View listing`. This would give all three property links the same accessible name. The current name begins with the visible words `View listing` and adds the property address, allowing links to be distinguished when reviewed outside the surrounding card context.

**The TypeScript safety warning was rejected as not applicable.**

Gemini warned that `imageAlt` or `listingUrl` might be optional in the external type. The actual `Property` interface was reviewed, and all fields required by `PropertyCard` are required rather than optional. A generic image fallback was therefore not added.

**Additional libraries and unrelated features were rejected.**

No library, database, authentication system, backend service, or persistent Favorite storage was added.

### Verification

- `npm.cmd run lint` completed with no errors.
- The button was reached with the keyboard and displayed its existing visible focus ring.
- Before activation, the browser rendered:

- `aria-pressed="false"`
- `aria-label="Save property: add 1221 Minorca Dr, Pacific Palisades, CA 90272 to favorites"`
- Visible text: `Save property`

- Pressing `Space` activated the button.
- After activation, the browser rendered:

- `aria-pressed="true"`
- `aria-label="Saved: remove 1221 Minorca Dr, Pacific Palisades, CA 90272 from favorites"`
- Visible text: `Saved`

The visible button label was present at the beginning of each accessible name. The source review and browser test were not treated as proof of complete WCAG compliance.

**Related commit:** `Apply verified Gemini accessibility critique`

## Midterm Examination AI Provenance

The midterm is being completed incrementally inside the existing Neighborhood Listing Platform. Each stage follows this process: AI-assisted draft, review against the examination requirements, adaptation to the existing project, verification, and a focused Git commit. Suggested results are not recorded as verified until the corresponding check has actually been performed.

| Step / Tool | Prompt Summary | Model Output Used | Model Output Rejected & Rationale | Verification Method | Associated Git Commit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Exam setup / ChatGPT and Codex | Break down the midterm and guide its implementation step by step inside the existing Neighborhood Listing Platform. | Used the branch workflow, examination checklist, environment review, and file-by-file implementation process. | Rejected treating any AI-generated draft, suggested test result, or account-level action as completed before reviewing and verifying it in the actual project. | Verified the GitHub remote, clean starting state, required examination branch, pushed branch, and environment-ignore rules. | `898dd21` |
| AI provenance setup / ChatGPT and Codex | Add the required midterm provenance structure without removing the existing Lab 1-3 AI history. | Added the required columns for prompt summaries, accepted output, rejected output, verification, and commit attribution. | Rejected replacing the existing AI log because the earlier laboratory history remains relevant project evidence. | Reviewed the saved Markdown table and confirmed the earlier laboratory entries remained present. | `b450c6d` |
| Requirements and traceability / Codex | Draft the three required midterm user stories and connect them to the implementation files. | Used the Property Owner, Public Inquirer, and Platform Administrator stories with Given/When/Then criteria and scope estimates. | Rejected route links that did not match the existing project's `src/app` structure. No implementation was marked complete solely because it appeared in a requirement. | Confirmed that `docs/requirements.md` contains three scoped stories and links to the migration, validation contract, API route, and property component. | `f832fac` |
| Database schema and RLS / Codex | Draft the required PostgreSQL tables, constraints, relationships, and row-level security policies. | Used the five required tables, UUID keys, foreign keys, checks, UTC timestamps, indexes, RLS activation, public policies, owner policies, inquiry policies, and administrator policies. | Rejected claiming that the migration had executed successfully because it has not yet been applied to the connected Supabase project. No credentials or real user data were added. | Reviewed the migration file against the examination's required tables, fields, constraints, relationships, and access rules. Live Supabase execution remains pending. | `6bc4754` |
| Security audit matrix / Codex | Draft positive and negative authorization tests for anonymous users, owners, inquirers, administrators, and trusted server access. | Used the role-based test matrix and live-verification procedure in `docs/security-audit.md`. | Rejected marking expected outcomes as verified results before running the tests with genuine Supabase user sessions. | Confirmed every live result is labeled as pending and that the matrix includes the required permitted and denied operations. | `757b558` |
| Property validation / ChatGPT and Codex | Implement the exam-specific runtime contract without replacing the broader Lab 3 data model. | Used an AJV 2020-12 strict five-field schema, a reusable validator, and 16 tests covering valid, missing, invalid, injected, and unknown fields. | The initial Zod draft was valid under the exam wording but was replaced with AJV to remain consistent with the Lab 3 validation approach. Rejected npm audit fix --force and used a tested minimatch override instead. | Sixteen tests passed; TypeScript passed; ESLint passed; npm audit found zero vulnerabilities; the Next.js production build passed. | `d0bb6c7`, `ec41dfe` |
| Supabase server clients / ChatGPT and Codex | Add secure Supabase clients for public, authenticated-user, and trusted administrative operations. | Used a public anonymous client, a user-session client that preserves RLS identity, a separately isolated service-role client, and a placeholder-only environment example. | Rejected using the service-role client for normal property requests and rejected exposing the service-role key with a NEXT_PUBLIC_ prefix. | TypeScript passed; ESLint passed; npm audit found zero vulnerabilities; the production build passed; a secret-reference scan confirmed that the service-role variable appears only in the admin client and placeholder environment example. | `43de412` |
| Property API / ChatGPT and Codex | Implement approved-only property reads and authenticated, validated draft creation through a Next.js Route Handler. | Used structured JSON errors, a 16 KB body limit, strict validation before database access, six-column approved-only GET, authenticated profile-role verification, server-controlled owner ID and draft status, and HTTP 201 creation responses. | Rejected using the service-role client for owner requests, accepting client-supplied owner or status fields, returning raw database errors, and relying only on UI validation. | Twenty-eight tests passed; TypeScript passed; ESLint passed; npm audit found zero vulnerabilities; the production build passed and included the dynamic /api/properties route. | `6342e9f` |
| Live property API verification / ChatGPT and Codex | Verify the property API against the connected Supabase project using public, invalid, unauthenticated, and authenticated-owner requests. | Used a reusable smoke-test script that avoids printing passwords, tokens, or API keys. | Rejected treating mocked tests as live database evidence and rejected exposing authentication secrets in terminal output. | Invalid input returned HTTP 400; unauthenticated valid input returned HTTP 401; the authenticated property owner created fictional draft `b9df51e0-9a38-4af0-a6c5-e343a6469d5c`; the public GET response remained empty, confirming the draft was not publicly exposed. | `83393b4` |
| Database security hardening / ChatGPT and Codex | Tighten table privileges and require a valid property_owner profile for owner operations. | Used a follow-up versioned migration that removed broad grants, denied truncate access, fixed the administrator helper search path, and recreated owner policies with role checks. | Rejected relying on RLS alone for operations such as TRUNCATE and rejected treating migration success as sufficient without post-migration privilege and policy checks. | Supabase returned Success; all seven privilege assertions returned true; all five tables retained the expected 16 policies. | `81b7c3a` |
| Live multi-role RLS audit / ChatGPT and Codex | Verify public visibility, owner isolation, inquiry privacy, administrator authority, and trusted server access using genuine Supabase identities. | Used a credential-safe live audit script with fictional fixtures for Owner A, Owner B, an administrator, anonymous access, and the service role. | Rejected SQL-editor-only role simulation because database-owner execution bypasses RLS, and rejected printing passwords, JWTs, or API keys as evidence. | The live audit passed: approved-only public properties, active-only sponsors, owner-scoped edits, approved/cross-owner update denial, anonymous inquiry submission without inquiry reads, owner inquiry isolation, and admin/service read-write access across all five tables. | `512962c` |
| Accessible property interface / ChatGPT and Codex | Review the existing PropertyCard and complete the examination semantic, responsive, focus, and keyboard requirements without replacing earlier lab behavior. | Preserved the existing property interface, image, favorite control, listing link, and dark styling; added a distinct header, functional View Details disclosure button, accessible state attributes, and explicit 1/2/3-column grid classes. | Rejected replacing the existing page or removing prior Lab 2 behavior solely to satisfy the exam slice. | Twenty-eight tests passed; TypeScript, ESLint, npm audit, and the production build passed; manual Tab, Shift+Tab, Enter, and Space testing passed with visible focus rings; mobile/tablet/desktop layouts displayed 1/2/3 columns. | `416e6d2` |
| Hosted exam preview / ChatGPT and Codex | Configure and verify a public Vercel Preview deployment for the examination branch without merging the pull request. | Used Preview-scoped Config values for the public Supabase URL/key, a Preview-scoped Secret for the service-role key, and the stable exam-branch preview domain. | Rejected promoting the unreviewed branch to production, exposing secret values, and leaving Vercel Authentication enabled because it blocked instructor access. | Vercel built commit `5bac75b`; the hosted page and approved-property GET returned HTTP 200, invalid POST returned HTTP 400, unsigned valid POST returned HTTP 401, and public access was confirmed without Vercel login. | `5bac75b` |


## Lab 5 — Existing-project review and setup checkpoint

**Tool:** ChatGPT / Codex  
**Review date:** 2026-11-02 (America/Los_Angeles)  
**Source snapshot:** `e0cb2e3e2270e07dc8644cdc85bf86e9a638681b`, uploaded from the student's clean, synced `exam/practical-persistence-eval` branch.  
**Associated commit:** Pending; no commit or push was made.

### Exact kickoff prompt

<details>
<summary>Expand the complete user prompt</summary>

```text
Help me complete CIS 3610 Lab 5: PostgreSQL, Supabase, CRUD, and Row-Level Security in my existing neighborhood-listing-platform project.

My goal is a complete, understandable submission that meets the professor’s requirements while using my available ChatGPT usage efficiently. I am a beginner and need to explain what I built and why.

Working method:

1. Inspect the current repository and Git status before changing anything. Identify completed work, missing requirements, and reusable code. Preserve unfinished Lab 4 work and unrelated changes.
2. Use the assignment and rubric as the scope. Prioritize schema/migrations, RLS design and tests, CRUD integration, and secret hygiene. Avoid optional features, unnecessary dependencies, broad refactoring, and duplicate documentation.
3. Follow the professor’s lab sequence. Maintain one overall checklist, but show me only the current step, its purpose, the action needed, and how we will verify it. Batch related implementation work when it is safe to do so.
4. Reuse existing components, TypeScript types, Zod validation, tests, and documentation where appropriate. Create or change code only when needed. Explain significant changes in plain English.
5. Build around properties, sponsors, property_sponsors, profiles, and inquiries. Review ownership, keys, required fields, checks, timestamps, and deletion behavior. Store database changes in versioned migrations and use fictional seed data.
6. Treat authorization as a core requirement. Enable RLS on exposed tables, allow public access only to intended records, and enforce ownership and approval restrictions. Preserve the requesting user’s identity for ordinary database operations. Keep privileged credentials server-only.
7. Test anonymous, owner, other authenticated user, and administrator access. Include attempts to change ownership or approval status. Distinguish RLS restrictions from server authorization and database constraints; do not invent an RLS denial for a service role that bypasses RLS.
8. Implement the required GET and POST or PATCH routes with validation, authorization, explicit response fields, and safe errors. Connect the existing UI and provide loading, empty, and error states.
9. Run meaningful checks appropriate to each change. Record actual requests, authentication state, responses, and before/after data where needed. Clearly label anything drafted, untested, blocked, or awaiting my action. Never invent results.
10. Record material AI assistance in docs/ai-log.md, including exact prompts, useful and rejected output, verification, and commit references once available. At required Gemini or AI Studio checkpoints, provide the prompt and wait for the real output I supply.
11. Never request or display real credentials. Use placeholders in shared evidence. Verify ignored configuration and scan tracked files and Git history before release.
12. Maintain concise handoff notes in the repository: current branch, changed files, completed requirements, checks run, remaining tasks, decisions, and the exact next step. Keep these useful for continuing with a lighter model.

Make authorized local draft changes when repository access is available. Stop before committing, pushing, merging, deploying, or modifying a remote database until I explicitly authorize that action. If you cannot access something, say so and request only the specific information needed.

Begin with a read-only repository check and the first Lab 5 step. i know you said not to paste it back, you can put the work into the same local folder or you can use the workspace in chatgpt and put the code there while you work on the assignment i will run the code
```

</details>

### Useful output retained

- Reuse the existing five-table migrations, public/user/service clients, AJV input validation, GET/POST route, components, and exam tests instead of rebuilding them.
- Add a focused handoff/checklist in [lab5-handoff.md](lab5-handoff.md) to preserve the audit, remaining requirements, and next action for continuation with a lighter model.
- Identify that the homepage still imports the local property array, so the database route is not yet connected to its listing UI.
- Review the approved-record owner DELETE policy, denial-test assertions, reproducible seeding/rebuild, exact diagnostic evidence, and missing ownership/self-approval negative tests before implementation.

### Rejected assumptions and deferred work

- Do not substitute Zod for the AJV implementation actually present in this branch. The prompt's mention of Zod does not establish it as the current validator.
- Do not treat exam live-test notes as newly executed Lab 5 results, or any service-role access as proof of ordinary-user RLS.
- Do not replace existing migrations or overwrite working `.env.local` configuration. Do not assume Lab 3/4 work absent from this archive is absent from other branches.
- Do not add PATCH, an admin dashboard, a new dependency, or optional audit-events functionality solely to expand the project; GET plus POST already covers the route methods explicitly requested by the lab.
- Gemini/AI Studio reviews, runtime checks, live database operations, history scanning, commits, and deployment remain pending.

### Verification performed

The ZIP's embedded commit matches the student's reported HEAD. Only `.env.example` is included among environment files, and its three values are placeholders. The supplied ignore rules were tested in an isolated temporary repository: `.env.local` and `.env.production` are ignored, while `.env.example` is allowed. A preliminary pattern scan of 47 text files found no private-key/JWT/Supabase-secret/GitHub-token matches; this is a limited snapshot check, not a full secret or Git-history audit. Source and test definitions were read, but dependencies were not installed and tests, lint, typecheck, build, and live database checks were not run here. No application or SQL code changed.


## Lab 5 — Setup confirmation and relationship design

**Tool:** ChatGPT / Codex  
**Instruction basis:** Continue under the exact Lab 5 kickoff prompt above, after the student provided real setup results.  
**Associated commit:** Pending; these are uncommitted documentation drafts.

### Student verification received

The student ran `git switch -c feature/database`, which reported the new branch. `Test-Path .env.local` returned `True`, `git check-ignore .env.local` returned `.env.local`, and `git status` reported `feature/database` with a clean working tree. No configuration values were requested or shared.

### Output retained and review decisions

- Added [database-design.md](database-design.md), describing the five existing tables, primary/foreign keys, required fields, checks, timestamps, cardinalities, and actual cascade behavior.
- Flagged owner deletion of approved listings, inquiry target visibility, validation differences, and weak denial assertions for review. These are source findings, not newly executed exploit tests.
- Rejected rebuilding the schema, duplicating the GET/POST routes, inventing sponsor ownership columns, or treating the service role as subject to ordinary-user RLS.
- Updated [lab5-handoff.md](lab5-handoff.md) to mark setup and the drafted relationship review complete and record the exact next checkpoint.

### Prepared external AI checkpoint

The exact self-contained prompt and supplied code are saved in [lab5-ai-review-prompt.txt](lab5-ai-review-prompt.txt). It contains both existing migrations in order, the actual AJV property schema, and the denial helper needing review. The student is to submit it to a Gemini model in Google AI Studio. **Submission, model identity, real output, accepted/rejected suggestions, and resulting verification are pending.** No Gemini result has been fabricated or recorded as received.

### Verification scope

The design and included SQL were compared with the uploaded source; application, migration, and test code are unchanged. No runtime suite, database migration, live role test, commit, push, or deployment was performed in this step.


## Lab 5 — External review evaluated and owner DELETE migration drafted

**Tools:** Student-supplied external AI response; ChatGPT/Codex source review.  
**Model:** Gemini Flash-Lite, as reported by the student. Exact version was not supplied.  
**Exact prompt:** [lab5-ai-review-prompt.txt](lab5-ai-review-prompt.txt).  
**Response evidence:** Student's pasted response in this Lab 5 conversation, beginning “1. Analysis: Strengths, Defects, Decisions, and Improvements.” Evaluation and specific accepted/rejected claims are preserved in [database-design.md](database-design.md).  
**Associated commit:** Pending; no commit/push.

**Useful output:** Confirmed the status-unrestricted owner DELETE policy and weak denial helper. Accepted restricting owner deletions to owned draft/rejected listings while retaining ownership/role checks. Used the proposed policy predicate, adapted to ALTER POLICY in a new numbered migration instead of changing previously applied SQL.

**Rejected/adapted output:** The new helper rejects legitimate expected permission errors, so it is not copied verbatim. WITH CHECK (true) is not necessary for anonymous inquiry access. The four-role matrix omits the other authenticated user and admin denial. Placeholder profile IDs cannot seed records unless those Auth users exist. The seed misses multiple required fixtures. Stopping the local stack before db reset omits the running-stack requirement, and no local configuration was supplied. Do not run those reset commands on the hosted project.

**Verification:** Compared the policy predicate with the existing hardening migration and PostgreSQL ALTER POLICY documentation; checked expected denial semantics and CLI prerequisites in official Supabase documentation. Confirmed prior migrations are unchanged. The follow-up is a local, unapplied draft; no parser/database execution, role test, seed, reset, commit, or deployment has been performed. Actual live verification remains pending. The student subsequently identified the review model as Gemini Flash-Lite; no exact version was supplied.


### Filename discussion resolved

The student initially requested no numeric prefix. An unnumbered workspace draft was prepared, then the functional dependency and lab requirement were clarified. The student resumed from the original numbered laptop filename; the workspace was restored to match. SQL content did not change. The unnumbered download is superseded.


## Lab 5 — Reusable fictional seed draft and offline safety checks

**Tool:** ChatGPT/Codex; continuing under the exact kickoff prompt above.  
**Input:** Student confirmed resumption from `feature/database` with the expected five draft paths, including the numbered SQL migration.  
**Associated commit:** Pending; no commit/push.

**Output retained:** Added a shared fixture builder and development seed entry point, reusing the existing Supabase SDK and exam account environment-variable names. The real seed obtains UUIDs from authenticated accounts, preflights collisions/roles, preserves existing roles, and writes fictional rows in dependency order. Added an offline preview and separate Node safety tests; documented rebuild prerequisites and future exact role/evidence checks in `docs/lab5-database-verification.md`.

**Output rejected/adapted:** Rejected the external review's arbitrary profile UUID inserts and incomplete seed. Did not run reset, modify remote data, introduce new packages, or claim an administrative seed proves RLS. No actual credentials were added. Existing exam scripts were left intact; the shared fixture module can be imported by upcoming Lab 5 authorization checks.

**Actual workspace verification:** `node --check scripts/lab5-seed.mjs` passed. `node --test tests/lab5-seed.node-test.mjs` passed all 6 tests: account identity/role separation, role protection, unrelated-row collision rejection, known-fixture restore allowance, credential-free offline preview, and apply-mode refusal with missing configuration. The dry-run printed 3 profiles, 2 sponsors, 5 properties, 3 connections, and 2 inquiries. No dependency install or network/database request was needed. Full project lint/typecheck/Vitest/build and live seed/RLS/rebuild checks remain pending.


## Lab 5 — Student seed verification and strict authorization audit draft

**Tool:** ChatGPT/Codex, continuing under the recorded kickoff prompt and reviewed Gemini Flash-Lite output.  
**Actual student evidence:** Seed dry-run returned 3 profiles, 2 sponsors, 5 properties, 3 links, 2 inquiries; all 6 offline seed safety tests passed on the laptop.  
**Associated commit:** Pending.

**Used:** Added strict zero-row versus SQL-error assertions, snapshot comparisons, credential redaction, a guarded live database REST audit, and future request/response capture. Reused the seed fixtures and extracted account setup into one shared module. Added the correct four-role properties matrix and actual repository policy statements to the existing security audit document.

**Rejected/adapted:** No any-error-as-denial helper; no invented HTTP responses; no service-role substitution for the other authenticated user; no marking local assertion tests as live RLS evidence. Existing exam evidence and scripts remain intact. The live runner refuses to overwrite evidence and treats failed fixture restoration as failure.

**Workspace verification actually run:** Combined Node suite passed all 13 tests; audit/client syntax checks passed; offline seed preview still produced the expected counts. The original six tests were rerun because shared seed setup changed. No remote sign-in, fixture write, SQL execution, live RLS check, credential output, commit, or deployment occurred. Full project checks and application/browser integration remain pending.


### Student verification: combined offline suite

The student supplied laptop output for `node --test tests/lab5-seed.node-test.mjs tests/lab5-audit.node-test.mjs`: 13 tests passed, 0 failed (192.3512 ms reported). This confirms the offline helper/safety checks in the student's environment. It is not evidence of live RLS or migration execution. No database changes are reported. Next: verify presence of required local configuration without exposing values and obtain explicit authorization for the identified development project's migration, fictional seed, and fixture-mutating/restoring live audit.


### Development configuration and authorization received

The student reported SET for all nine required environment-variable names without sharing values. In response to the explicit request to confirm the development Supabase target and authorize the prepared migration, fictional seed, and live role tests, the student answered: “this is my project yes”. This authorizes those scoped development actions; no reset, commit, push, or deployment is included. Next assigned action is applying only `20261103000000_lab5_owner_delete_unapproved.sql` in the existing development project and returning a read-only policy verification. Application, seed execution, and live test results remain pending until the student supplies actual output.


### Student verification: owner DELETE migration applied

The student ran the saved numbered Lab 5 migration in the authorized development project's SQL Editor and reported `Success. No rows returned`. A subsequent `pg_policies` query returned `properties_owner_delete_own`, command `DELETE`, roles `{authenticated}`, and a USING expression requiring matching `auth.uid()`, status in `draft/rejected`, and an existing matching profile with role `property_owner`. This confirms the saved definition, not live denial behavior. No claim is made that SQL Editor application created a Supabase CLI migration-history entry.

Next assigned action: run the prepared fictional seed from the laptop with its existing private configuration and explicit development-host guard, then return actual output. Seed and live RLS results are still pending. Authorization already covers migration, seed, and fixture-mutating/restoring audit; do not ask again for the same scope.


### Student verification: fictional development seed applied

The student ran the guarded seed with the existing private `.env.local` and supplied real output: `Fictional Lab 5 seed writes completed using real development Auth UUIDs.` Counts were profiles 3, sponsors 2, properties 5, property_sponsors 3, inquiries 2. This verifies that the seed completed, not ordinary-user RLS. No credentials were supplied in chat. The next authorized action is the separate live role audit with actual redacted request/response evidence and fixture restoration.


### Student-reported live role audit result

The student supplied actual terminal output: `Live checks passed: 23. Evidence: docs/lab5-live-evidence.json`. This reports a completed live development database REST audit. The evidence JSON has not yet been uploaded/inspected in this workspace, so per-check payloads, raw responses, and restoration status must still be reviewed before finalizing the authorization assignment. These checks do not establish application-route or browser behavior.


### Uploaded live evidence inspected

Inspected the student's `lab5-live-evidence.json`: completed=true, 23 of 23 checks passed, cleanup says original fictional records restored and verified. All saved protected-write snapshots match; captured API-key and Authorization fields contain placeholders/absence markers. Preserved the JSON byte-for-byte in the repository and populated the existing security-audit document with genuine requests, HTTP statuses, and raw response bodies. Anonymous draft SELECT and nonowner UPDATE returned 200/[]; anonymous property INSERT returned 401/42501; self-approval returned 403/42501; invalid admin/service prices returned 400/23514. Rejected interpreting all denials as 403 or treating service constraints as RLS. The admin all-table read result records a passed snapshot check without raw exchanges; this limitation is stated. A second uploaded JSON was identical. No rerun or new database operation occurred.


## Lab 5 — Step 12 database listing UI draft

**Tool:** ChatGPT/Codex, continuing the recorded Lab 5 work. **Student input:** Uploaded the requested installed Next.js guide archive and confirmed “sent”; a second uploaded guide archive was identical. **Associated commit:** Pending; no commit/push.

**Guides read before edits:** Installed package guides for server/client components, fetching data, client-side fetching, error handling, route handlers, and use-client. Retained the existing client homepage and implemented a cancellable browser request to the existing public GET route, without a new fetching dependency or a server-to-own-route request.

**Output used:** Replaced the homepage static property import with `/api/properties` loading. Added a public-response loader that checks render-critical values and maps `square_feet` to `squareFeet`. Reused the placeholder artwork; made the shared external listing URL optional and conditionally rendered its link. Added distinct loading, database-empty, filtered-empty, safe error, and retry states, with aborted/stale response guards. Preserved favorites, details, sponsors, existing styling, and existing static data files. Added All neighborhoods and corrected the previous Pacific Palisades bypass so neighborhood choices actually filter addresses. Added focused Vitest coverage and `docs/lab5-ui-verification.md`. Updated the handoff and database-verification current status to reflect already-completed live work.

**Actual verification:** Fifteen focused loader scenarios passed using Node 24 native TypeScript execution and mocked fetch with strict assertions: mapping/options, empty result, HTTP failure, network failure, nine malformed payloads, invalid JSON, and abort propagation. These were not a Vitest suite run or a browser test. `npm ci --ignore-scripts --no-audit --no-fund` failed with HTTP 403 downloading `zod-validation-error@4.0.2`; full lint, Vitest, typecheck, build, and browser checks therefore remain pending on the laptop. No dependency version or lockfile change was intended. No database request, reset, commit, push, or deployment occurred. The existing 23-check database evidence was preserved and not rerun.


## Lab 5 — Student production checks and browser verification

**Tool:** ChatGPT/Codex; continuing the recorded Lab 5 workflow. **Associated commit:** Pending.

**Actual laptop checks supplied:** Initial plain npm commands failed because PowerShell blocked npm.ps1 before the checks ran. The student used npm.cmd without changing execution policy. ESLint and TypeScript completed without reported issues; Vitest 4.1.12 passed all 43 tests in 4 files (5 HTTP helper, 15 property loader, 16 schema, 7 route). Next.js 16.4.3 production build completed successfully, including all 5 static pages; /api/properties remains dynamic. npm.cmd start reported Ready on localhost:3000. These results supersede the earlier pending laptop verification, while the workspace dependency-install failure remains accurately recorded.

**Actual application evidence:** Student supplied a public API JSON body containing two database listings and a homepage screenshot showing matching addresses, prices, bedrooms/bathrooms, square footage, placeholder illustrations, and 2 properties shown. After the explicit checks, the student replied “yes alla checks out” for matching values, favorites, details, Malibu no-match, and All neighborhoods restoration. After separate browser request-blocking/unblocking instructions, the student replied “yes” for the generic error state and successful retry. These confirmations are reported manual outcomes, not an independent automated browser run. No HTTP status/headers were provided with that browser JSON body.

**Documentation updated:** Current verification guide, handoff checklist, database-design migration status, and database-verification summary now distinguish completed checks from remaining work. Loading under throttling, database-empty/malformed-response UI, mobile/keyboard-only checks, stale-response browser cases, clean-environment rebuild, and repository/history/contribution/release review remain unverified where applicable. No new application code, database request, reset, commit, push, or deployment was performed for this update.


## Lab 5 — Secret/history review and clean schema reconstruction

**Tool:** ChatGPT/Codex; continuing the recorded Lab 5 workflow. **Associated commit:** Pending. **File review/commit/push approvals:** Still pending as separate steps.

**Actual student evidence:** The laptop was on feature/database with the expected source/documentation changes and new scripts/tests. `.env.local` was ignored. Current and available-history private-env filename scans returned no paths other than the separately confirmed ignored local file. The specified common-credential grep and Git-history pickaxe checks returned no matching filenames or commit IDs. This is a limited pattern/history scan, not a guarantee that every secret format is absent. No actual configuration values were requested or supplied.

**Clean-environment decision and execution:** Docker was not recognized in PowerShell. The student created the separate empty hosted project neighborhood-lab5-rebuild, then ran the saved schema migration, security-hardening migration, and owner-delete follow-up in order. Each returned Success. No rows returned. The student reported a pre-run warning on the second file but did not retain its wording. Source inspection confirmed permission changes and four policy replacements; the exact warning cause remains unknown. The original development project and application configuration were retained.

**Verification returned:** A read-only catalog query in the rebuild project returned inquiries/profiles/properties/property_sponsors/sponsors with RLS true and policy counts 3/2/6/3/2. The properties DELETE predicate requires matching auth.uid(), draft/rejected status, and a property_owner profile. This verifies schema reconstruction in the clean hosted environment; it does not claim CLI reset/history tracking, exhaustive catalog comparison, seeded accounts, or a fresh 23-check role run there. The earlier live-role and application evidence stays associated with the original development project.

**Output retained:** Added lab5-rebuild-evidence.md with exact query/results and lab5-reflection.md as a reviewable contribution/reflection draft. Updated current handoff/database-design/verification and security documentation. The reflection distinguishes Pedro's execution/verification from ChatGPT/Codex drafting and Gemini Flash-Lite review. Anderson Mejia Sanchez is identified as assigned partner, with no invented completed contribution/review. Commit/PR/review/deployment links remain pending.

**Verification of this update:** Documentation-only changes; no application code, migration files, test definitions, dependencies, remote database requests, reset, commit, push, or deployment was performed here. Prior AI-log entries were preserved.

## Lab 5 implementation commit

Implementation commit: `25e900a` — feat: complete Lab 5 database security and listing integration.

This commit contains the Lab 5 implementation, test evidence, AI-review decisions, clean-rebuild evidence, and student-reviewed reflection.
