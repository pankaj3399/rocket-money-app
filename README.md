# Rocket Money App

A modern web application for managing personal finances, built with Next.js, React, and MongoDB.

## Features

- User authentication and authorization
- Secure password management
- Modern UI with Tailwind CSS
- Responsive design
- Dark/Light theme support
- Email notifications
- Progress tracking
- Interactive components

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/AdityaRai24/rocket-money-app.git
cd rocket-money-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_USER=your_email
EMAIL_APP_PASSWORD=your_email_password
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Tech Stack

- **Frontend:**
  - Next.js 15
  - React 19
  - Tailwind CSS
  - Radix UI Components
  - Next Auth for authentication

- **Backend:**
  - Next.js API Routes
  - MongoDB with Mongoose
  - Bcrypt for password hashing
  - Nodemailer for email functionality

## Project Structure

```
rocket-money-app/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── lib/             # Utility functions and configurations
├── models/          # MongoDB models
├── public/          # Static assets
└── ...config files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.
