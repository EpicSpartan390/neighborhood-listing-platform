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
- The property address uses an `<h3>`, which fits beneath the page section’s `<h2>`.
- The image alternative text is built dynamically from typed property data.
- The Favorite control is a native `<button>` with `type="button"`, an `onClick` handler, `aria-pressed`, and a property-specific accessible name.
- The listing is a native link with an accessible name that identifies the property.
- Both interactive controls include visible `focus-visible` ring classes.
- The component receives a typed `Property` prop.
- The image and control layout includes responsive classes.

**Issue identified:**

The component created the image alternative with the property address followed by `property.imageAlt`, but the original `imageAlt` data also contained part of the address. This could cause a screen reader to announce repetitive information.

**Why it matters:**

Alternative text should communicate the image’s purpose concisely. Repeating the property address makes the announcement longer without adding useful information.

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

 ## Lab 3: Google AI Studio Structured Data Generation and Validation

**Date:** October 8, 2026
**Tool and model:** Google AI Studio — Gemini 3.8 Flash
**Configuration:** Structured outputs enabled; Google Search, Code execution, Function calling, Google Maps, and URL context disabled.

### Purpose

Gemini was used to generate five entirely fictional Southern California property records for course testing. The generated data was treated as an untrusted AI draft and validated against the project’s authoritative JSON Schemas before use.

### Generation Prompt

> Generate one synthetic property dataset containing exactly five fictional residential properties in Southern California.
>
> Requirements:
>
> - All records, street addresses, descriptions, and property details must be invented for this course lab.
> - Do not copy, retrieve, or represent actual real-estate listings.
> - Set `_metadata.synthetic` to `true`.
> - Use the exact metadata values required by the output schema.
> - Produce exactly five records.
> - Use each permitted `property_id` exactly once, in numerical order from ending `0001` through `0005`.
> - Pair those records with each permitted `listing_url` exactly once, in order from `property-1` through `property-5`.
> - Give every property a different fictional street address and use a plausible Southern California city, California ZIP code, price, bedroom count, bathroom count, and square footage.
> - Make the five properties meaningfully varied in size, price, city, and amenities.
> - Use only amenities allowed by the schema, with no duplicate amenity within a record.
> - Use `/property-placeholder.svg` for every property image.
> - Write useful, concise image alternative text describing the fictional home.
> - Include one or two fictional sponsors per property.
> - Keep each sponsor’s ID, name, URL, and image logically matched.
> - Clearly identify each sponsor as fictional in its description.
> - Do not include commentary, citations, Markdown, code fences, or fields not defined by the structured-output schema.
> - Return only the structured JSON result required by the active schema.

### AI Studio Schema Adjustments

The authoritative Draft 2020-12 schemas were not changed or weakened.

A separate `schemas/ai-studio-output.schema.json` helper was created because AI Studio accepts a narrower and complexity-limited schema. AI Studio first rejected `additionalProperties` and `title` in its editor. After those helper-only keywords were removed, inference returned a constraint-complexity error:

> Constraint is too tall: 8380 (vs max of 5888)

The AI Studio helper schema was simplified by removing its long enum lists and descriptions. The strict enum, format, range, required-field, and unexpected-property rules remained in the authoritative Ajv schemas.

### Initial AI Output and Validation Failure

The untouched output was preserved as:

`data/generated/synthetic-properties.raw.json`

The JSON passed syntax parsing, but strict Ajv validation found 19 contract violations. All violations were amenity values written as human-readable phrases instead of the permitted enum values.

Examples included:

- `Attached Garage` instead of `GARAGE_PARKING`
- `Central Air Conditioning` instead of `AIR_CONDITIONING`
- `Solar Panels` instead of `SOLAR_PANELS`
- `Swimming Pool` instead of `SWIMMING_POOL`
- `EV Charging Station` instead of `EV_CHARGING`

Unsupported values such as `Hardwood Floors`, `Backyard Patio`, `Wine Cellar`, and `Private Courtyard` were also rejected.

This demonstrated that syntactically valid JSON is not necessarily valid application data.

### Human Review and Corrections

Only the amenities arrays were corrected. The generated metadata, IDs, addresses, numerical property details, image information, listing URLs, and sponsor information were retained.

| Property | Corrected amenities |
|---|---|
| 1 | `GARAGE_PARKING`, `AIR_CONDITIONING` |
| 2 | `GARAGE_PARKING` |
| 3 | `SOLAR_PANELS` |
| 4 | `SWIMMING_POOL`, `EV_CHARGING` |
| 5 | `AIR_CONDITIONING` |

The reviewed dataset was saved as:

`data/generated/synthetic-properties.json`

### Verification

- `npm.cmd run validate:data` reported: `PASS: The AI-generated dataset satisfies the data contract.`
- `node scripts/check-schemas.mjs` confirmed that both schemas are valid Draft 2020-12 schemas and that the dataset schema resolves its property-schema reference.
- `npm.cmd run lint` completed without errors.
- The original AI output remains available separately for comparison and audit evidence.
- The AI Studio structured-output screenshot is stored at `docs/ai-studio-structured-output.png`.

**Related commit:** `feat: add validated synthetic property dataset`

## Lab 3: ChatGPT and Gemini Normalization Review

**Date:** October 8, 2026
**Tools:** ChatGPT and Google AI Studio with Gemini 3.8 Flash

### Review Prompt

Both AI tools were asked to review the validated normalization boundary as an AI-generated draft. The prompt described:

- Ajv validation of untrusted JSON before normalization.
- The snake_case property and sponsor contracts.
- Conversion to camelCase UI models.
- Address formatting.
- Sponsor deduplication by `sponsor_id`.
- Controlled amenity values.
- Amenities and sponsor tiers being validated but not displayed.

The tools were asked to identify strengths, normalization risks, information loss, the appropriate amenity representation, the smallest course-project recommendation, and changes that should wait for a real backend.

### Shared Findings

Both ChatGPT and Gemini confirmed these strengths:

- Untrusted input is validated before it reaches the UI.
- Explicit snake_case-to-camelCase mapping keeps the external contract separate from the interface model.
- Controlled amenity values prevent inconsistent variations such as `A/C`, `AC`, and `Air Conditioning`.
- Sponsor deduplication prevents repeated sponsor banners.
- A relational join table would be excessive for the current static course project.

### Accepted Recommendation

Amenities remain a controlled enum:

- `AIR_CONDITIONING`
- `CENTRAL_HEATING`
- `GARAGE_PARKING`
- `SWIMMING_POOL`
- `EV_CHARGING`
- `SOLAR_PANELS`

This decision was supported by the original AI-generated output. Gemini produced 19 human-readable amenity values that failed the authoritative schema. Controlled values therefore provide observable protection against spelling variations and unsupported categories.

The validation-first normalization boundary was retained. External JSON begins as `unknown`, must pass Ajv validation, and is only then converted into the existing `Property` and `Sponsor` interfaces.

### Recommendation Rejected for Current Scope

Gemini recommended retaining the full structured address in the UI model and computing a separate display value.

That recommendation was not implemented because:

- The authoritative input data still retains separate street, city, state, and ZIP fields.
- Only the UI projection combines those fields.
- The existing `PropertyCard` and filtering code expect one display string.
- No current interface feature needs separately styled or editable address fields.
- Changing the interface, card, filters, and related tests would exceed the smallest necessary course-project change.

A structured UI address can be reconsidered if future requirements introduce city-specific sorting, editing, or separate address-field presentation.

### Finding Rejected as Inapplicable

Gemini suggested that unused amenities and sponsor tiers could add unnecessary fields to frontend state models.

The normalization output does not include those fields. They are validated at the boundary but omitted from the current `Property` and `Sponsor` UI objects. Therefore, no change was required.

### Deferred Recommendations

The following were deferred until a real database or backend exists:

- Separate Sponsor and PropertySponsor database tables.
- Database-managed amenity records.
- An administrative amenity editor.
- Server-side filtering, pagination, sorting, and sponsor deduplication.

### Documented Limitation

Sponsors are deduplicated with a `Map` keyed by `sponsor_id`. If two records use the same ID but contain conflicting sponsor details, the first version is retained. The current synthetic dataset uses consistent sponsor identities, so conflict-resolution logic was not added.

### Verification

- The reviewed dataset passes Ajv validation.
- The untouched AI-generated dataset fails because of invalid amenities.
- Five valid properties are normalized for the UI.
- Two unique sponsors are rendered.
- Vitest reports 2 passing test files and 10 passing tests.
- ESLint passes.
- TypeScript passes with no errors.
- The Next.js production build succeeds.
- Browser verification confirms five property cards and two sponsor banners.
- Gemini evidence is stored at `docs/screenshots/lab3-gemini-normalization-critique.png`.
- Validated UI evidence is stored at `docs/screenshots/lab3-validated-ui.png`.

**Decision:** Keep controlled amenity enums and the current validation-first UI projection. Defer relational normalization until a database-backed requirement exists.