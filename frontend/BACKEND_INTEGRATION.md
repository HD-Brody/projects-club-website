# Connecting Frontend to Backend

This guide explains how the login/signup functionality connects to the backend API.

## Setup

### 1. Environment Configuration

Create a `.env.local` file in the `frontend/` directory:

```bash
VITE_API_URL=http://localhost:5000
```

If you don't create this file, the default `http://localhost:5000` will be used.

### 2. Start the Backend

Make sure your Flask backend is running:

```bash
cd backend
python run.py
```

The backend should be running on `http://localhost:5000`.

### 3. Start the Frontend

```bash
cd frontend
npm run dev
```

## API Integration

### API Utility (`src/utils/api.ts`)

The API utility provides functions to interact with the backend:

#### Auth Functions
- `authApi.login(email, password)` - Login user
- `authApi.signup(email, password, name)` - Register new user
- `authApi.requestPasswordReset(email)` - Request password reset
- `authApi.resetPassword(token, newPassword)` - Reset password with token

#### Profile Functions
- `profileApi.getProfile()` - Get user profile
- `profileApi.updateProfile(description, skills)` - Update user profile

#### Auth Utilities
- `authUtils.setToken(token)` - Store JWT token
- `authUtils.getToken()` - Retrieve JWT token
- `authUtils.removeToken()` - Remove JWT token (logout)
- `authUtils.isAuthenticated()` - Check if user is logged in

## How It Works

### 1. **Login Flow**

```
User enters credentials → handleLoginSubmit() → authApi.login()
→ Backend validates → Returns JWT token
→ Token stored in localStorage → User is authenticated
```

**Code:**
```tsx
const response = await authApi.login(email, password);
if (response.data) {
  authUtils.setToken(response.data.access_token);
  setIsLoggedIn(true);
}
```

### 2. **Signup Flow**

```
User enters details → handleSignupSubmit() → authApi.signup()
→ Backend creates user → Auto-login with credentials
→ Token stored → User is authenticated
```

**Code:**
```tsx
const response = await authApi.signup(email, password, name);
if (!response.error) {
  // Auto-login after successful signup
  const loginResponse = await authApi.login(email, password);
  authUtils.setToken(loginResponse.data.access_token);
}
```

### 3. **Password Reset Flow**

```
User requests reset → handleResetPassword() → authApi.requestPasswordReset()
→ Backend generates token → Returns token (in dev mode)
→ User can reset password with token
```

### 4. **Profile Update Flow**

```
User updates profile → handleProfileSubmit() → profileApi.updateProfile()
→ Backend updates database → Returns success
→ UI shows confirmation
```

## Backend Routes Used

The frontend connects to these backend routes:

| Frontend Function | Backend Route | Method | Description |
|------------------|---------------|---------|-------------|
| `authApi.login` | `/api/auth/login` | POST | User login |
| `authApi.signup` | `/api/auth/signup` | POST | User registration |
| `authApi.requestPasswordReset` | `/api/auth/request-password-reset` | POST | Request password reset |
| `authApi.resetPassword` | `/api/auth/reset-password` | POST | Reset password |
| `profileApi.updateProfile` | `/api/profile/` | PUT | Update user profile |
| `profileApi.getProfile` | `/api/profile/` | GET | Get user profile |

## Authentication State

The app maintains authentication state in two places:

1. **localStorage** - JWT token persists across page refreshes
2. **React state** - `isLoggedIn` flag controls UI

When the page loads, it checks for an existing token:

```tsx
useEffect(() => {
  const token = authUtils.getToken();
  if (token) {
    setIsLoggedIn(true);
  }
}, []);
```

## Error Handling

All API calls return a consistent response format:

```tsx
interface ApiResponse {
  data?: any;      // Success data
  error?: string;  // Error message
  status: number;  // HTTP status code
}
```

Example usage:
```tsx
const response = await authApi.login(email, password);
if (response.error) {
  alert(`Login failed: ${response.error}`);
} else {
  // Success - use response.data
}
```

## CORS Configuration

Make sure your Flask backend has CORS enabled for the frontend:

```python
from flask_cors import CORS
CORS(app, origins=['http://localhost:5173'])
```

## Testing

### Test Login
1. Create a user via signup
2. Use those credentials to log in
3. Check browser DevTools → Application → Local Storage for `access_token`

### Test API Calls
Open browser DevTools → Network tab to see API requests:
- Request URL
- Request payload
- Response data
- HTTP status codes

## Common Issues

### Issue: "Network error"
- **Cause**: Backend is not running or wrong URL
- **Fix**: Check that backend is running on `http://localhost:5000`

### Issue: "CORS error"
- **Cause**: CORS not configured on backend
- **Fix**: Add CORS middleware to Flask app

### Issue: "401 Unauthorized"
- **Cause**: Invalid token or token expired
- **Fix**: Log out and log in again to get a new token

### Issue: Changes not reflecting
- **Cause**: Token in localStorage is invalid
- **Fix**: Clear localStorage and refresh page

## Next Steps

To enhance the authentication:

1. **Add token expiration handling** - Refresh tokens automatically
2. **Add protected routes** - Redirect to login if not authenticated
3. **Add user context** - Share auth state across components
4. **Improve error messages** - Show user-friendly error notifications
5. **Add loading spinners** - Better UX during API calls
