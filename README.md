# SIH 2026 Internal Hackathon Portal

Official internal hackathon management portal for Shri Ramswaroop Memorial University (SRMU), organized by the Tech Fusion Club.

This platform serves as the central hub for the SIH 2026 internal hackathon, providing students with event timelines, official notices, live evaluation slots, and team registration details. It includes a secure, real-time administrative control panel for seamless event management.

## Architecture and Tech Stack

- **Frontend Framework**: React.js (via Vite)
- **Routing**: React Router v6
- **Backend and Database**: Firebase (Authentication and Firestore)
- **Styling**: Pure CSS with a custom variable design system

## Key Features

**Public Portal:**
- **Dynamic Homepage**: Event overview, theme browsing, and integrated quick links.
- **Live Evaluation Slots Tracking**: A dedicated dashboard (`/slots`) to track live evaluation schedules of over 130+ teams across 2 days. 
  - Organized by Days (Day 1 & Day 2) and Venues (B1-007, B1-207, B2-305).
  - Real-time status indicators (Upcoming ⏳, Done ✅, Absent ❌) and color-coded Track badges.
- **Live Timeline**: Visual tracking of hackathon phases with contextual call-to-action buttons (e.g., direct links to view slots during hackathon days).
- **Notices Board**: Real-time notices and alerts ticker.
- **Teams Directory**: Searchable directory of registered teams.

**Admin Control Panel:**
- **Secure Access**: Email/password authentication protecting the dashboard.
- **Dynamic Slot Management**: 
  - Real-time CRUD operations for Evaluation Slots.
  - Granular control over team status updates, timings, and venues.
  - Automated seeding capability for bulk importing schedule data.
- **Content Management**: Real-time CRUD operations for Notices, Teams, and Timeline events.
- **Security**: Protected routing preventing unauthorized database writes.

## Organization
Maintained by the Tech Fusion Club, SRMU.
