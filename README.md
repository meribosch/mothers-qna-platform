# Newborn Care Q&A Platform

A community-driven Q&A platform where expectant and new mothers can ask questions about newborn care, receiving support from both experienced mothers and an AI assistant.

## Features

- User registration and authentication
- Question posting and management
- Tag-based categorization
- Community answers with voting system
- AI-powered immediate responses
- Content moderation tools
- Mobile-responsive design

## Tech Stack

- **Frontend:**
  - Next.js 13+ (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - Zustand (State Management)

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Navigate to the project directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Create a `.env.local` file in the root directory and add necessary environment variables:
   ```
   NEXT_PUBLIC_API_URL=your_api_url
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js 13 app directory
│   ├── components/          # Reusable React components
│   ├── stores/             # Zustand store definitions
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── ...configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/) 