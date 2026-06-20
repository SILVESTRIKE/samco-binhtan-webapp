# SAMCO Binh Tan Dealership Portal

This repository contains the client-side web application for the SAMCO dealership and VinFast portal. Built using React, Vite, and Tailwind CSS, this platform provides an interactive vehicle catalog, accessory store, and e-commerce functionalities designed to showcase and facilitate vehicle sales.

## Tech Stack

- **Frontend Core**: React 18 (with functional components and hooks)
- **Routing**: React Router DOM 6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS (version 3) with custom theme setups
- **Build Tool**: Vite (supporting Fast Refresh with SWC)

## Page Registry

The application structure includes the following page views:
- **Home**: Main portal landing page highlighting featured vehicles and announcements.
- **Cars & Motorcycles**: Showroom and detailing pages for vehicles.
- **Accessories**: E-commerce interface for ordering parts and vehicle upgrades.
- **Charging Station Locator**: Portal utility to find vehicle charging locations.
- **News**: Company announcements, automotive news, and press releases.
- **Offers**: Active discount campaigns and dealership promotions.
- **Careers**: Job listings and recruitment portal.
- **Auth**: User login and registration pages.
- **Cart**: Shopping cart review for checkout.
- **Support & Utilities**: Help center, contact forms, and client tools.

## Project Structure

```
src/
├── api/          # API integration services
├── components/   # Reusable UI components
├── contexts/     # React Context providers for global state
├── hooks/        # Custom React hooks
├── pages/        # Main route views and page layouts
├── routes/       # Route configuration mapping page paths
└── utils/        # Helper functions and utilities
```

## Prerequisites

- Node.js >= 16.x
- npm or yarn

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/SILVESTRIKE/samco-binhtan-webapp.git
   cd samco-binhtan-webapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build the application for production:
   ```bash
   npm run build
   ```

## Development Scripts

- `npm run dev`: Starts the local development server with Vite.
- `npm run build`: Bundles the application using Vite for production deployment.
- `npm run lint`: Analyzes the codebase using ESLint to enforce styling rules.
- `npm run preview`: Locally previews the production build.

