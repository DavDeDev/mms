# MMS - Mentorship Management System

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

This project is built with Supabase and Next.js, providing a powerful and scalable foundation for your web application.

## 🚨 Important Note


> [!WARNING]  
> I can't add you to the Vercel project as it's a PRO feature, so you'll need to deploy the project to your own Vercel account.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or later)
- pnpm

If you don't have pnpm installed, you can install it using npm:

```bash
npm install -g pnpm
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in the environment variables in `.env.local` (see Environment Variables section below)

5. Run the development server:
   ```bash
   pnpm dev
   ```

## 🔐 Environment Variables

This project uses the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project's anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase project's service role key
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth client ID

To obtain these variables:

1. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 
   - Log in to your Supabase account
   - Go to your project's dashboard
   - Click on the "Settings" icon in the left sidebar
   - Click on "API" in the settings menu
   - You'll find the URL and anon key under "Project API keys"

2. `SUPABASE_SERVICE_ROLE_KEY`:
   - In the same "API" section of your Supabase project settings
   - You'll find the service role key under "Project API keys"

3. `NEXT_PUBLIC_GOOGLE_CLIENT_ID`:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
      - Select your project or create a new one
      - Go to "APIs & Services" > "Credentials"
      - Create a new OAuth client ID or use an existing one
      - The client ID will be displayed in the credentials list

      If you encounter any issues retrieving your environment variables, please feel free to [contact me](https://github.com/DavDeDev) for assistance.

## 🤝 Contributing

We welcome contributions to this project. Please follow these steps to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to pass the pipeline before asking for review. Run the following command to check if the pipeline passes:

```bash
pnpm build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.io/)
- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
