# Neighborhood Listing Platform

A minimal, accessible starter for a neighborhood property platform. This project demonstrates a workflow in which AI proposes work, the student reviews and tests it, and Git records the decisions.

## Features

- Listings for neighborhood properties
- Information about neighborhood sponsors
- Accessible voice-help planning

## Technology

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Node.js and npm
- Git and GitHub
- Vercel for deployment

## Run Locally

Install the project packages:

```text
npm install
```

## Lab 2 Component Hierarchy

The Lab 2 interface will use reusable, typed components. The page will provide
search controls, a responsive property grid, individual property cards, and
clearly identified sponsored content.

```text
Home Page
├── SearchFilters
├── Listing Grid
│   ├── PropertyCard
│   ├── PropertyCard
│   └── PropertyCard
└── SponsorBanner
```

Shared data types:

- `Property` defines the information required by each property card.
- `Sponsor` defines the information required by the sponsor banner.
