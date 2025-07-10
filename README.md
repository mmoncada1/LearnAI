# 🧠 Learn Anything With AI

> **AI-powered personalized learning path generator** - Transform any topic into a structured learning roadmap with curated resources.

![Learn Anything With AI](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge)

## ✨ Features

- **🎯 Smart Topic Analysis**: Input any skill or topic and get an intelligent breakdown
- **📚 Curated Resources**: Real, working links to high-quality learning materials
- **📈 Progress Tracking**: Check off completed stages and visualize your progress
- **🎚️ Difficulty Levels**: Beginner, Intermediate, and Advanced paths
- **⚡ Fast Generation**: Powered by GPT-4 for accurate, relevant learning paths
- **📱 Responsive Design**: Beautiful UI that works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone and setup**
   ```bash
   cd learn-anything-ai
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **AI Integration** | OpenAI GPT-4 Turbo |
| **Icons** | Heroicons |
| **Deployment** | Vercel Ready |

## 🎮 How It Works

1. **Enter Your Topic** - Type anything you want to learn (e.g., "Machine Learning", "Web Development")
2. **Choose Your Level** - Select beginner, intermediate, or advanced
3. **Get Your Path** - AI generates a personalized learning roadmap with 5-8 stages
4. **Follow & Track** - Click through resources and check off completed stages
5. **Celebrate Progress** - Watch your progress bar fill up as you learn!

## 📋 Example Learning Paths

- **Frontend Development** → HTML/CSS → JavaScript → React → Projects → Portfolio
- **Data Science** → Python Basics → Pandas/NumPy → Visualization → Machine Learning → Projects
- **Digital Marketing** → Fundamentals → SEO → Social Media → Analytics → Campaign Management

## 🎯 API Reference

### Generate Learning Path

**POST** `/api/generate-path`

```json
{
  "topic": "Full-stack web development",
  "difficulty": "beginner"
}
```

**Response:**
```json
{
  "topic": "Full-stack web development",
  "difficulty": "beginner",
  "estimatedTime": "12-16 weeks",
  "description": "Complete guide to building web applications from frontend to backend",
  "stages": [
    {
      "title": "HTML & CSS Fundamentals",
      "description": "Learn the building blocks of web pages",
      "resources": [
        {
          "title": "freeCodeCamp HTML/CSS Course",
          "url": "https://www.freecodecamp.org/learn/responsive-web-design/",
          "type": "course",
          "duration": "15 hours"
        }
      ]
    }
  ]
}
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add your `OPENAI_API_KEY` in Environment Variables
   - Deploy!

### Environment Variables for Production

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🔧 Development

### Project Structure
```
learn-anything-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── types/                 # TypeScript types
├── public/               # Static assets
└── package.json          # Dependencies
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

We welcome contributions! Here are ways you can help:

- 🐛 **Bug Reports** - Found an issue? Let us know!
- 💡 **Feature Ideas** - Have a cool idea? Share it!
- 🔧 **Code Contributions** - Submit a PR with improvements
- 📚 **Documentation** - Help improve our docs

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run test`
5. Commit: `git commit -m "Add feature"`
6. Push: `git push origin feature-name`
7. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **OpenAI** for the powerful GPT-4 API
- **Vercel** for seamless deployment
- **Tailwind CSS** for beautiful styling
- **Heroicons** for clean iconography

---

<div align="center">

**Made with ❤️ for learners everywhere**

[Report Bug](https://github.com/yourusername/learn-anything-ai/issues) • [Request Feature](https://github.com/yourusername/learn-anything-ai/issues) • [Documentation](https://github.com/yourusername/learn-anything-ai/wiki)

</div>
