# AICEO SaaS Platform

AICEO is a premium AI-powered SaaS platform designed to assist business leaders, entrepreneurs, and decision-makers by providing specialized AI "Decision Units" and "Bot Personas".

This repository contains the front-end implementation of the AICEO dashboard, chat interfaces, and administrative tools.

## 🚀 Key Features

*   **Role-Based Chat**: Interact with specialized AI personas like "Logistics Expert", "Algorithms Master", and "Commission Strategist".
*   **Decision Units (DUs)**: Modular knowledge bases that power the AI's decision-making capabilities (e.g., "Margin Low Strategy", "Competitor Analysis").
*   **Credit System**: Pay-per-use model with a detailed credit wallet and transaction history.
*   **Analytics Dashboard**: Real-time insights into user engagement, credit consumption, and bot performance.
*   **Admin Tools**: Comprehensive settings for platform configuration and user management.
*   **News & Updates**: Integrated changelog and relevant industry news for users.
*   **Knowledge Base**: A centralized FAQ and support center.

## 🛠 Technology Stack

*   **Structure**: Semantic HTML5
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN for rapid prototyping)
*   **Icons**: [Google Material Symbols](https://fonts.google.com/icons)
*   **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
*   **Scripting**: Vanilla JavaScript

## 📂 Project Structure

```text
AICEO_SaaS/
├── index.html              # Main Dashboard (Analytics & Overview)
├── chat.html               # Chat Hub / Selection Screen
├── chat_logistics.html     # Active Chat Interface (Logistics Persona)
├── chat_algorithm.html     # Active Chat Interface (Algorithm Persona)
├── chat_commission.html    # Active Chat Interface (Commission Persona)
├── decision_units.html     # DU Library & Management
├── bot_personas.html       # AI Persona Library
├── credits.html            # Wallet & Transaction History
├── analytics_detailed.html # Detailed Usage Reports
├── news.html               # changelog & News
├── faq.html                # Frequently Asked Questions
├── settings.html           # Admin Settings
├── docs/                   # Documentation & Architecture
│   └── database_schema.md  # Database Design Specifications
└── README.md               # Project Documentation
```

## ⚡ Quick Start

1.  Clone the repository.
2.  Open any `.html` file (e.g., `index.html`) in your modern web browser.
3.  Navigate through the sidebar to explore the platform features.

> **Note**: This is currently a static front-end implementation. Backend integration (API endpoints, database connections) is required for full functionality.

## 🎨 Design System

The platform uses a custom configuration of Tailwind CSS:
*   **Primary Color**: Amber (`#FBBF24`) - Used for branding and key actions.
*   **Dark Mode**: Native support with `dark:` classes (`bg-sidebar-dark`, `text-slate-100`).
*   **Glassmorphism**: Utilizes `backdrop-blur` and semi-transparent backgrounds for a modern SaaS aesthetic.

## 🔒 License

Proprietary Software. All rights reserved.
