# OAuth Setup Guide for Guest Review Manager

This guide explains how to set up Google and Apple OAuth authentication for your Guest Review Manager app.

## Quick Setup Summary

✅ **Code Implementation**: Complete - OAuth buttons and handlers are implemented
✅ **Database Setup**: Complete - Auto-profile creation for OAuth users
⚠️ **OAuth Provider Setup**: Required - Follow steps below

## 🔧 Required OAuth Configuration

### 1. Google OAuth Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

#### Step 2: Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "Guest Review Manager"
   - User support email: your email
   - Developer contact information: your email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
   - `openid`

#### Step 3: Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth Client ID"
3. Application type: "Web application"
4. Add Authorized JavaScript origins:
   - `https://ymjszykyahkmaspgwsby.supabase.co`
   - Your app's domain (when deployed)
5. Add Authorized redirect URIs:
   - `https://ymjszykyahkmaspgwsby.supabase.co/auth/v1/callback`

#### Step 4: Configure in Supabase
1. Copy your Google Client ID and Client Secret
2. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/82c79c92-97f3-46db-aa01-1eb7a78ab03c/auth/providers)
3. Enable Google provider
4. Paste Client ID and Client Secret
5. Save configuration

### 2. Apple OAuth Setup

#### Step 1: Apple Developer Account
1. You need an Apple Developer account ($99/year)
2. Go to [Apple Developer Portal](https://developer.apple.com/)

#### Step 2: Create App ID and Service ID
1. In Developer Portal, go to "Certificates, Identifiers & Profiles"
2. Create an App ID for your app
3. Create a Services ID for Sign in with Apple
4. Configure the Services ID:
   - Primary App ID: Select your app ID
   - Web Domain: `ymjszykyahkmaspgwsby.supabase.co`
   - Return URL: `https://ymjszykyahkmaspgwsby.supabase.co/auth/v1/callback`

#### Step 3: Generate Private Key
1. Create a new Key for Sign in with Apple
2. Download the .p8 file (keep it secure!)
3. Note the Key ID

#### Step 4: Configure in Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/82c79c92-97f3-46db-aa01-1eb7a78ab03c/auth/providers)
2. Enable Apple provider
3. Enter:
   - Services ID (Client ID)
   - Team ID (from Apple Developer account)
   - Key ID
   - Private Key (content of .p8 file)

### 3. Supabase URL Configuration

**CRITICAL**: Set the correct redirect URLs in Supabase:

1. Go to [Authentication > URL Configuration](https://supabase.com/dashboard/project/82c79c92-97f3-46db-aa01-1eb7a78ab03c/auth/url-configuration)
2. Set Site URL: `https://your-app-domain.com` (or development URL)
3. Add Redirect URLs:
   - `https://your-app-domain.com/**`
   - `http://localhost:3000/**` (for development)

## 🚀 How OAuth Works in Your App

### Automatic Sign Up Process
1. User clicks "Continue with Google" or "Continue with Apple"
2. User is redirected to OAuth provider
3. User authorizes your app
4. **If user doesn't exist**: Supabase automatically creates account
5. **If user exists**: User is signed in
6. User is redirected back to your app (already authenticated)
7. Profile is automatically created in database

### User Data Handling
- **Google**: Provides name, email, profile picture
- **Apple**: Provides name (first time only), email (may be private)
- **Auto-created profiles**: Name extracted from OAuth data
- **Business name**: Can be updated later in settings

## 📱 Platform Support

### Google OAuth
- ✅ Web browsers
- ✅ Mobile web browsers
- ✅ All platforms

### Apple OAuth
- ✅ Safari (all platforms)
- ✅ iOS Safari/Chrome
- ✅ macOS Safari/Chrome
- ⚠️ Limited on non-Apple platforms

## 🔒 Security Features

1. **Secure Token Storage**: Supabase handles token management
2. **Auto-Refresh**: Tokens automatically refresh
3. **Global Sign Out**: Clears all sessions
4. **Redirect URL Validation**: Prevents OAuth hijacking

## 🐛 Troubleshooting

### Common Issues

**"requested path is invalid" error**:
- Check Site URL and Redirect URLs in Supabase settings
- Ensure OAuth redirect URIs match exactly

**Google OAuth not working**:
- Verify authorized origins include Supabase URL
- Check OAuth consent screen is published
- Ensure required scopes are enabled

**Apple OAuth not working**:
- Verify Services ID configuration
- Check private key format
- Ensure domain verification is complete

**User gets stuck in login loop**:
- Clear browser cookies/localStorage
- Check for multiple OAuth providers with same email

## 📞 Next Steps

1. **Set up Google OAuth** (recommended first - easier setup)
2. **Test the authentication flow**
3. **Set up Apple OAuth** (if targeting iOS users)
4. **Configure production redirect URLs** when deploying

## 🎯 Testing Checklist

- [ ] Google OAuth sign up (new user)
- [ ] Google OAuth sign in (existing user)  
- [ ] Apple OAuth sign up (new user)
- [ ] Apple OAuth sign in (existing user)
- [ ] Profile auto-creation works
- [ ] Sign out functionality
- [ ] Redirect URLs work correctly