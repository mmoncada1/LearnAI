# SkillMapAI - Authentication & Progress Tracking Update

This update adds comprehensive user authentication and progress tracking capabilities to SkillMapAI, allowing users to save their learning paths and track their progress over time.

## New Features

### 🔐 User Authentication
- **User Registration**: New users can create accounts with email and password
- **User Login**: Existing users can sign in to access their saved progress
- **JWT Authentication**: Secure token-based authentication system
- **Password Security**: Bcrypt hashing for secure password storage

### 📊 Progress Tracking
- **Save Learning Paths**: Authenticated users can save generated learning paths
- **Track Progress**: Mark resources as completed within each learning stage
- **Progress Visualization**: Visual progress bars showing completion percentages
- **Learning Dashboard**: Comprehensive dashboard to view all active and completed paths

### 🎯 Enhanced User Experience
- **Persistent Progress**: Learning progress is saved across browser sessions
- **User Profile**: View user stats including active paths and completed resources
- **Save Prompts**: Non-authenticated users are prompted to sign up when trying to save progress
- **Success Notifications**: Visual feedback when actions are completed successfully

## Technical Implementation

### Backend APIs
- `/api/auth/register` - User registration endpoint
- `/api/auth/login` - User login endpoint
- `/api/auth/verify` - Token verification endpoint
- `/api/user/progress` - Get and save user progress
- `/api/user/progress/update` - Update resource completion status

### Data Storage
- **File-based Storage**: Simple JSON file storage for user data and progress
- **User Data**: Stored in `data/users.json` (password hashed)
- **Progress Data**: Stored in `data/progress.json`

### Security Features
- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **JWT Tokens**: Secure, stateless authentication tokens
- **Protected Routes**: Middleware protection for user-specific API endpoints
- **Input Validation**: Server-side validation for all user inputs

## Setup Instructions

### 1. Install Dependencies
```bash
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

### 2. Environment Configuration
Create a `.env.local` file with:
```env
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
```

### 3. Data Directory
The application automatically creates the `data/` directory and initializes:
- `data/users.json` - User account information
- `data/progress.json` - User learning progress data

### 4. Start Development Server
```bash
npm run dev
```

## Usage Guide

### For New Users
1. **Generate a Learning Path**: Use the main interface to create a learning path
2. **Sign Up Prompt**: Click "Save Progress" to be prompted to create an account
3. **Create Account**: Fill in name, email, and password to register
4. **Automatic Save**: Future learning paths are automatically saved

### For Existing Users
1. **Sign In**: Click "Sign In" in the header to access your account
2. **View Dashboard**: Click "Dashboard" to see all your learning paths
3. **Track Progress**: Check off completed resources in your learning paths
4. **Monitor Stats**: View completion statistics and progress metrics

### Dashboard Features
- **Active Paths**: View all currently active learning paths with progress bars
- **Completed Paths**: See all fully completed learning journeys
- **Progress Tracking**: Click into any path to mark resources as completed
- **Statistics**: Overview of total active paths, completed paths, and resources done

## File Structure
```
/lib/
  ├── auth.ts              # Authentication utilities
  ├── database.ts          # Data storage functions
  └── AuthContext.tsx      # React authentication context

/components/
  ├── AuthModal.tsx        # Login/Register modal
  ├── UserProfile.tsx      # User profile dropdown
  ├── UserDashboard.tsx    # Learning progress dashboard
  └── Notification.tsx     # Success/error notifications

/app/api/
  ├── auth/
  │   ├── login/route.ts   # Login endpoint
  │   ├── register/route.ts # Registration endpoint
  │   └── verify/route.ts   # Token verification
  └── user/
      └── progress/
          ├── route.ts      # Progress CRUD operations
          └── update/route.ts # Progress update endpoint

/data/
  ├── users.json          # User account data
  └── progress.json       # Learning progress data
```

## Security Considerations

### Production Deployment
1. **Change JWT Secret**: Use a strong, randomly generated JWT secret
2. **Environment Variables**: Store sensitive data in environment variables
3. **HTTPS**: Ensure all authentication requests use HTTPS
4. **Database**: Consider migrating to a proper database (PostgreSQL, MongoDB)
5. **Rate Limiting**: Implement rate limiting on authentication endpoints

### Current Limitations
- File-based storage (suitable for development/small deployments)
- No email verification (can be added later)
- Basic password requirements (6+ characters)
- No password reset functionality (can be implemented)

## Future Enhancements

### Planned Features
- **Email Verification**: Verify email addresses during registration
- **Password Reset**: Allow users to reset forgotten passwords
- **Social Login**: Integration with Google, GitHub, etc.
- **Advanced Analytics**: More detailed progress tracking and insights
- **Learning Streaks**: Track consecutive days of learning activity
- **Achievement System**: Badges and rewards for milestones

### Database Migration
For production use, consider migrating to:
- **PostgreSQL**: With Prisma ORM for better data management
- **MongoDB**: For flexible document storage
- **Supabase**: For hosted PostgreSQL with auth features
- **Firebase**: For real-time features and authentication

## Testing the Features

### Test User Registration
1. Navigate to the application
2. Generate a learning path
3. Click "Save Progress"
4. Fill in the registration form
5. Verify the account is created and you're logged in

### Test Progress Tracking
1. Sign in to your account
2. Open the Dashboard
3. Click on an active learning path
4. Mark resources as completed
5. Verify progress updates in real-time

### Test Authentication Persistence
1. Sign in to your account
2. Refresh the page
3. Verify you remain logged in
4. Check that your progress is maintained

## Troubleshooting

### Common Issues
1. **Server not starting**: Check if ports 3000-3003 are available
2. **Authentication errors**: Verify JWT_SECRET is set in environment
3. **Data not saving**: Check that the `data/` directory exists and is writable
4. **Progress not updating**: Ensure you're authenticated and have a valid token

### Debug Steps
1. Check browser console for error messages
2. Verify API endpoints are responding (Network tab)
3. Check server logs for backend errors
4. Ensure environment variables are loaded correctly

This authentication system provides a solid foundation for user management and progress tracking while maintaining the app's simplicity and ease of use.
