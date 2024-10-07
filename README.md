# Virtual Art Exhibition Curator

## Project Overview

You have always dreamt of curating antiquities and fine artworks. Now, a coalition of museums and universities has approached you to create viewer-driven virtual exhibitions from their combined catalogs. This project allows researchers, students, and art lovers to browse and curate personalized virtual exhibitions using an expansive collection of fine art from renowned museums and universities.

### Features

- **Exhibition Management**: Users can create, edit, or delete virtual exhibitions, saving them to local storage.
- **Saved**: Save upcoming, current or past exhibitions from Discover for easy access later.
- **Artwork Details**: Each artwork provides detailed information such as the artist, gallery location (if known), and its history in exhibitions.
- **Artwork Search**: Users can search for artworks using multiple filters, including artwork type, artist, and more.
- **APIs Used**: Art Institute of Chicago (AIC) API and Harvard Art Museums API.
- **Responsive Design**: Styled with Tailwind CSS, ensuring the site looks great across devices, including iPhones.

This project is built using **Next.js**, **TypeScript**, and **React**, and it is deployed on **Netlify**.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **TypeScript**: Ensures robust type-checking and enhanced development experience.
- **State Management**: Saving exhibitions and artworks using **Local Storage**.
- **APIs**: 
  - [Art Institute of Chicago (AIC) API](https://api.artic.edu/docs/)
  - [Harvard Art Museums API](https://harvardartmuseums.org/collections/api)

## Installation & Setup

To get a local copy of the project up and running, follow these steps:

### Prerequisites

Make sure you have **Node.js** installed.

### Installation

Clone the repository:

```bash
git clone https://github.com/your-repo/virtual-art-exhibition-curator.git

Navigate to the project directory:

bash
cd virtual-art-exhibition-curator

Install dependencies:

bash

npm install

Running the Development Server

To run the app in development mode, use the following command:

bash
npm run dev

Open http://localhost:3000 in your browser to see the app in action.

Building for Production

To create an optimized production build, run:

bash

npm run build

Deployment

This project is deployed on Netlify. To deploy your own version, link the project to Netlify and push changes to your GitHub repository.

Future Improvements
User Authentication: Allow users to create accounts and save exhibitions across sessions.
Advanced Filtering: Expand the search feature with additional filter options.
Collaboration Features: Allow multiple users to collaborate on an exhibition in real time.