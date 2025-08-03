# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Substory is a React Native subscription management app built with Expo Router. Users can track their monthly subscription services, view total costs, and manage payments. The app supports Kakao, Google, and Apple (iOS) authentication through Supabase.

## Technology Stack

- **Framework**: React Native with Expo (~53.0.9)
- **Navigation**: Expo Router (~5.0.7) with Stack navigation
- **Backend**: Supabase for authentication and database
- **State Management**: @tanstack/react-query for server state
- **Local Storage**: AsyncStorage for token management
- **Authentication**: Kakao Login, Google, Apple (iOS)
- **Notifications**: expo-notifications for payment reminders
- **Language**: TypeScript with strict mode enabled

## Development Commands

```bash
# Start development server
npm start

# Run on Android device/emulator
npm run android

# Run on iOS device/simulator (macOS only)
npm run ios

# Run web version
npm run web
```

## Project Architecture

### App Structure (Expo Router)

- `app/_layout.tsx` - Root layout with Stack navigation and safe area configuration
- `app/index.tsx` - Login screen with social authentication
- `app/home.tsx` - Main dashboard with subscription list and total cost
- `app/settings.tsx` - User settings and profile management
- `app/addSubscriptionModal.tsx` - Modal for adding new subscriptions

### Key Components

- `components/index/Header.tsx` - App header with user info and settings access
- `components/index/TotalPriceComponent.tsx` - Displays total monthly subscription cost
- `components/index/subscription/SubscriptionComponent.tsx` - Main subscription list with sorting and add functionality
- `components/index/subscription/SubscriptionItem.tsx` - Individual subscription card with delete action

### Core Utilities

- `utils/auth.ts` - Token management (save/get/remove tokens from AsyncStorage)
- `utils/subscription.ts` - Supabase client and CRUD operations for subscriptions
- `utils/notification.ts` - Push notification setup and payment reminders

### Data Management

- `hooks/useSubscriptions.ts` - React Query hook for fetching subscription data
- `types/subscription.ts` - TypeScript interface for Subscription model
- Database: Supabase table "subscriptions" with columns: user_id, name, price, date, payment_method

### Authentication Flow

1. User lands on login screen (`app/index.tsx`)
2. Session check redirects to home if already authenticated
3. Social login (Kakao primary, Google, Apple for iOS)
4. Tokens stored in AsyncStorage via `utils/auth.ts`
5. Supabase handles session management with auto-refresh

### Subscription Management

- Add subscriptions through modal with name, price, payment date, and method
- View total monthly cost calculated from all active subscriptions
- Sort by price, date, payment method, or default (alphabetical)
- Delete subscriptions with confirmation dialog
- Automatic payment notifications scheduled 1 day before due date

## Environment Configuration

Required environment variables in `.env`:

- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

Kakao SDK configuration in `app.json` with native app key for authentication.

## Database Schema

Supabase `subscriptions` table:

- `user_id` (uuid, references auth.users)
- `name` (text) - Service name
- `price` (integer) - Monthly cost
- `date` (integer) - Payment date (1-31)
- `payment_method` (text) - Payment method description
- `created_at` (timestamp)

## Key Development Notes

- Uses Expo Router file-based routing system
- React Query manages server state with automatic refetching
- AsyncStorage handles client-side token persistence
- Push notifications require permission handling on both platforms
- Kakao authentication requires Korean market-specific setup
- TypeScript strict mode enforced throughout codebase
- Safe area handling configured in root layout for modern devices

# Using Gemini CLI for Large Codebase Analysis

When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
context window. Use `gemini -p` to leverage Google Gemini's large context capacity.

## File and Directory Inclusion Syntax

Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
gemini command:

### Examples:

**Single file analysis:**

````bash
gemini -p "@src/main.py Explain this file's purpose and structure"

Multiple files:
gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"

Entire directory:
gemini -p "@src/ Summarize the architecture of this codebase"

Multiple directories:
gemini -p "@src/ @tests/ Analyze test coverage for the source code"

Current directory and subdirectories:
gemini -p "@./ Give me an overview of this entire project"

#
Or use --all_files flag:
gemini --all_files -p "Analyze the project structure and dependencies"

Implementation Verification Examples

Check if a feature is implemented:
gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"

Verify authentication implementation:
gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"

Check for specific patterns:
gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"

Verify error handling:
gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"

Check for rate limiting:
gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"

Verify caching strategy:
gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"

Check for specific security measures:
gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"

Verify test coverage for features:
gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"

When to Use Gemini CLI

Use gemini -p when:
- Analyzing entire codebases or large directories
- Comparing multiple large files
- Need to understand project-wide patterns or architecture
- Current context window is insufficient for the task
- Working with files totaling more than 100KB
- Verifying if specific features, patterns, or security measures are implemented
- Checking for the presence of certain coding patterns across the entire codebase

Important Notes

- Paths in @ syntax are relative to your current working directory when invoking gemini
- The CLI will include file contents directly in the context
- No need for --yolo flag for read-only analysis
- Gemini's context window can handle entire codebases that would overflow Claude's context
- When checking implementations, be specific about what you're looking for to get accurate results # Using Gemini CLI for Large Codebase Analysis


When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive
context window. Use `gemini -p` to leverage Google Gemini's large context capacity.


## File and Directory Inclusion Syntax


Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the
 gemini command:


### Examples:


**Single file analysis:**
```bash
gemini -p "@src/main.py Explain this file's purpose and structure"


Multiple files:
gemini -p "@package.json @src/index.js Analyze the dependencies used in the code"


Entire directory:
gemini -p "@src/ Summarize the architecture of this codebase"


Multiple directories:
gemini -p "@src/ @tests/ Analyze test coverage for the source code"


Current directory and subdirectories:
gemini -p "@./ Give me an overview of this entire project"
# Or use --all_files flag:
gemini --all_files -p "Analyze the project structure and dependencies"


Implementation Verification Examples


Check if a feature is implemented:
gemini -p "@src/ @lib/ Has dark mode been implemented in this codebase? Show me the relevant files and functions"


Verify authentication implementation:
gemini -p "@src/ @middleware/ Is JWT authentication implemented? List all auth-related endpoints and middleware"


Check for specific patterns:
gemini -p "@src/ Are there any React hooks that handle WebSocket connections? List them with file paths"


Verify error handling:
gemini -p "@src/ @api/ Is proper error handling implemented for all API endpoints? Show examples of try-catch blocks"


Check for rate limiting:
gemini -p "@backend/ @middleware/ Is rate limiting implemented for the API? Show the implementation details"


Verify caching strategy:
gemini -p "@src/ @lib/ @services/ Is Redis caching implemented? List all cache-related functions and their usage"


Check for specific security measures:
gemini -p "@src/ @api/ Are SQL injection protections implemented? Show how user inputs are sanitized"


Verify test coverage for features:
gemini -p "@src/payment/ @tests/ Is the payment processing module fully tested? List all test cases"


When to Use Gemini CLI


Use gemini -p when:
- Analyzing entire codebases or large directories
- Comparing multiple large files
- Need to understand project-wide patterns or architecture
- Current context window is insufficient for the task
- Working with files totaling more than 100KB
- Verifying if specific features, patterns, or security measures are implemented
- Checking for the presence of certain coding patterns across the entire codebase


Important Notes


- Paths in @ syntax are relative to your current working directory when invoking gemini
- The CLI will include file contents directly in the context
- No need for --yolo flag for read-only analysis
- Gemini's context window can handle entire codebases that would overflow Claude's context
- When checking implementations, be specific about what you're looking for to get accurate results
````
