# 🚀 Deployment Guide

## Quick Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Flearn-anything-ai)

### Step-by-Step Vercel Deployment

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect it's a Next.js project

3. **Add Environment Variables**
   - In your Vercel dashboard, go to Project Settings
   - Navigate to "Environment Variables"
   - Add: `OPENAI_API_KEY` with your actual API key
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~2 minutes

---

## Alternative Hosting Options

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify dashboard

### Railway
1. Connect your GitHub repo
2. Railway auto-detects Next.js
3. Add `OPENAI_API_KEY` in environment variables
4. Deploy automatically

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t learn-anything-ai .
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key learn-anything-ai
```

---

## Environment Variables

### Required
- `OPENAI_API_KEY` - Your OpenAI API key

### Optional
- `NEXT_PUBLIC_APP_URL` - Your deployed app URL (for OpenGraph)
- `NODE_ENV` - Set to `production` for optimizations

---

## Performance Tips

1. **Optimize Images** - Use Next.js Image component
2. **Enable Caching** - API responses can be cached
3. **Monitor Usage** - Keep track of OpenAI API usage
4. **Error Tracking** - Consider adding Sentry or similar

---

## Security Checklist

- ✅ API key stored in environment variables (not in code)
- ✅ HTTPS enabled (automatic with Vercel)
- ✅ Input validation on API routes
- ✅ Rate limiting (consider implementing)
- ✅ Error messages don't expose sensitive info
