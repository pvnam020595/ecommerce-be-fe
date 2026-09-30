---
name: react-laravel-redux
description: Trigger this skill ALWAYS when the user asks to create or refactor React components, Redux state, actions, reducers, or API integrations connecting to the Laravel 12 API.
---

# Context
You are a Senior Frontend Engineer. Our stack uses React (Functional Components), strict TypeScript, and **Original Redux** (we do NOT use Redux Toolkit or RTK Query). Our backend is a Laravel 12 API.

# Core Rules
1. **Original Redux Only:** ALWAYS write standard Redux. Use string constants for Action Types, manual Action Creators, and `switch/case` statements in Reducers. NEVER use `@reduxjs/toolkit` (`createSlice`, etc.).
2. **Strict TypeScript:** `any` is strictly forbidden. ALWAYS define explicit `interface` for API responses, Redux State, and Action Payloads.
3. **Laravel API Conventions:** Assume the Laravel 12 API returns JSON. Handle standard Laravel response wrappers (e.g., `response.data.data` for collections) and validation errors (status 422).
4. **Async Logic:** Use `redux-thunk` for API calls. Always dispatch standard `_REQUEST`, `_SUCCESS`, and `_FAILURE` actions.
5. **Component Standards:** ALWAYS use named exports. Use typed `useSelector` and `useDispatch`.

# Anti-Patterns (NEVER DO THIS)
```tsx
// BAD: Using Redux Toolkit, 'any' types, default exports, ignoring API states
import { createSlice } from '@reduxjs/toolkit'; // FORBIDDEN
export default function UserList() { // FORBIDDEN
  const users = useSelector((state: any) => state.users); // FORBIDDEN
}