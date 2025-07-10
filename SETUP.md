# 🔧 Setup Guide

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/learn-anything-ai.git
cd learn-anything-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
# Create environment file
cp .env.local.example .env.local

# Edit .env.local and add your OpenAI API key
OPENAI_API_KEY=your_actual_openai_api_key_here
```

### 4. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

---

## Getting Your OpenAI API Key

1. **Sign up for OpenAI**
   - Visit [platform.openai.com](https://platform.openai.com/)
   - Create an account or sign in

2. **Generate API Key**
   - Go to [API Keys page](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy the key (you won't see it again!)

3. **Add Billing Information**
   - Add a payment method in your OpenAI account
   - GPT-4 API usage is pay-per-use
   - Typical cost: $0.01-0.03 per learning path generation

---

## Testing Without API Key

Want to see how it works first? Use the **"View Demo Learning Path"** button on the homepage - no API key required!

---

## Troubleshooting

### Port 3000 in use?
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
npm run dev -- -p 3001
```

### Module not found errors?
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors?
```bash
# Generate fresh TypeScript config
npx tsc --init
```

### OpenAI API errors?
- Verify your API key is correct
- Check your OpenAI account has billing set up
- Ensure you have GPT-4 access

---

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
npm run type-check # Check TypeScript
```

---

## Customization

### Changing the AI Model
Edit `app/api/generate-path/route.ts`:
```typescript
model: "gpt-4-turbo-preview" // or "gpt-3.5-turbo" for lower cost
```

### Styling Changes
- Edit `tailwind.config.js` for theme changes
- Modify `app/globals.css` for custom styles
- Update components in `components/` folder

### Adding Features
- New API routes go in `app/api/`
- React components go in `components/`
- Types go in `types/index.ts`

---

## Need Help?

- 📖 [Documentation](https://github.com/yourusername/learn-anything-ai/wiki)
- 🐛 [Report Issues](https://github.com/yourusername/learn-anything-ai/issues)
- 💬 [Discussions](https://github.com/yourusername/learn-anything-ai/discussions)

---

Ready to start learning? 🚀
