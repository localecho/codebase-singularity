---
name: react_nextjs
description: React and Next.js development patterns with component generation, testing, and modern workflows
triggers:
  - react component
  - nextjs app
  - react testing
  - component generate
---

# Skill: React/Next.js Development Patterns

## Overview

Comprehensive React and Next.js development support including component generation patterns, Next.js App Router awareness, React Testing Library patterns, CSS-in-JS considerations, and modern React best practices for production applications.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              REACT/NEXT.JS DEVELOPMENT PIPELINE                  │
│                                                                   │
│   Feature Request                                                 │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │              COMPONENT GENERATION                        │    │
│   │  - Server vs Client components                           │    │
│   │  - Props interface design                                │    │
│   │  - Composition patterns                                  │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │              STATE MANAGEMENT                            │    │
│   │  - React hooks                                           │    │
│   │  - Server state (React Query/SWR)                        │    │
│   │  - Global state (Zustand/Jotai)                          │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │              STYLING                                     │    │
│   │  - CSS Modules                                           │    │
│   │  - Tailwind CSS                                          │    │
│   │  - CSS-in-JS (styled-components/emotion)                 │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │              TESTING                                     │    │
│   │  - React Testing Library                                 │    │
│   │  - Integration tests                                     │    │
│   │  - Visual regression                                     │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   Production Application                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Detection

### React/Next.js Indicators

```yaml
detection:
  next_js:
    files:
      - next.config.js
      - next.config.mjs
      - next.config.ts
    directories:
      - app/              # App Router
      - pages/            # Pages Router
      - .next/            # Build output

  react:
    package_json:
      dependencies:
        - react
        - react-dom
    file_patterns:
      - "*.tsx"
      - "*.jsx"

  framework_version:
    next_13_plus: "app/ directory exists"
    next_14_plus: "Server Actions in use"
```

### Project Structure Analysis

```yaml
# Next.js App Router structure
app_router_structure:
  app/
    - layout.tsx        # Root layout
    - page.tsx          # Home page
    - loading.tsx       # Loading UI
    - error.tsx         # Error boundary
    - not-found.tsx     # 404 page
    - globals.css       # Global styles

  components/
    - ui/               # Reusable UI components
    - features/         # Feature-specific components
    - layouts/          # Layout components

  lib/
    - utils.ts          # Utility functions
    - api.ts            # API helpers
    - hooks/            # Custom hooks

  types/
    - index.ts          # Shared types
```

---

## Component Generation Patterns

### Server Component (Default)

```typescript
// app/components/UserList.tsx
// Server Component - no "use client" directive

import { getUsers } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

export async function UserList() {
  const users = await getUsers();

  return (
    <ul className="space-y-4">
      {users.map((user: User) => (
        <li key={user.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
        </li>
      ))}
    </ul>
  );
}
```

### Client Component

```typescript
// app/components/Counter.tsx
'use client';

import { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
  onCountChange?: (count: number) => void;
}

export function Counter({
  initialValue = 0,
  step = 1,
  onCountChange,
}: CounterProps) {
  const [count, setCount] = useState(initialValue);

  const handleIncrement = () => {
    const newCount = count + step;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  const handleDecrement = () => {
    const newCount = count - step;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleDecrement}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        aria-label="Decrement"
      >
        -
      </button>
      <span className="text-xl font-bold" aria-live="polite">
        {count}
      </span>
      <button
        onClick={handleIncrement}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        aria-label="Increment"
      >
        +
      </button>
    </div>
  );
}
```

### Component Template

```yaml
component_template:
  structure:
    - Props interface with JSDoc
    - Default props where appropriate
    - Proper TypeScript types
    - Accessibility attributes
    - Error boundaries where needed

  naming:
    component: PascalCase
    file: PascalCase.tsx
    props: ComponentNameProps
    test: ComponentName.test.tsx

  exports:
    - Named export (preferred)
    - Index barrel exports for directories
```

### Component Generation Command

```typescript
// Component generator configuration
interface ComponentConfig {
  name: string;
  type: 'server' | 'client';
  directory: string;
  withTest: boolean;
  withStory: boolean;
  styling: 'tailwind' | 'css-modules' | 'styled-components';
}

// Generated files structure
// components/
//   Button/
//     Button.tsx
//     Button.test.tsx
//     Button.stories.tsx (optional)
//     Button.module.css (if CSS modules)
//     index.ts
```

---

## Next.js App Router Patterns

### Layouts

```typescript
// app/layout.tsx - Root Layout
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | My App',
    default: 'My App',
  },
  description: 'Application description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>{/* Navigation */}</header>
        <main>{children}</main>
        <footer>{/* Footer */}</footer>
      </body>
    </html>
  );
}
```

### Route Groups

```
app/
  (marketing)/
    about/
      page.tsx
    blog/
      page.tsx
    layout.tsx      # Marketing layout

  (app)/
    dashboard/
      page.tsx
    settings/
      page.tsx
    layout.tsx      # App layout (with auth)

  layout.tsx        # Root layout
```

### Dynamic Routes

```typescript
// app/users/[id]/page.tsx
interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps) {
  const user = await getUser(params.id);
  return {
    title: user.name,
  };
}

export default async function UserPage({ params }: PageProps) {
  const user = await getUser(params.id);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// Generate static params for static generation
export async function generateStaticParams() {
  const users = await getUsers();
  return users.map((user) => ({
    id: user.id,
  }));
}
```

### Server Actions

```typescript
// app/actions/user.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export async function createUser(formData: FormData) {
  const validatedFields = CreateUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email } = validatedFields.data;

  try {
    await db.user.create({ data: { name, email } });
  } catch (error) {
    return {
      message: 'Database error: Failed to create user.',
    };
  }

  revalidatePath('/users');
  redirect('/users');
}

// Usage in form
// <form action={createUser}>
//   <input name="name" />
//   <input name="email" />
//   <button type="submit">Create</button>
// </form>
```

### Loading and Error States

```typescript
// app/users/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
    </div>
  );
}

// app/users/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}
```

---

## React Testing Library Patterns

### Basic Component Test

```typescript
// components/Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Testing Forms

```typescript
// components/LoginForm/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits form with valid data', async () => {
    const handleSubmit = jest.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows validation errors', async () => {
    const user = userEvent.setup();

    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});
```

### Testing Async Components

```typescript
// components/UserProfile/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

// Mock fetch or API client
jest.mock('@/lib/api', () => ({
  getUser: jest.fn(),
}));

import { getUser } from '@/lib/api';

describe('UserProfile', () => {
  it('displays user data after loading', async () => {
    (getUser as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    });

    render(<UserProfile userId="1" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    (getUser as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    render(<UserProfile userId="1" />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
```

### Testing Hooks

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('resets count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });
});
```

### Test Configuration

```typescript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/*.stories.{ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);

// jest.setup.ts
import '@testing-library/jest-dom';
```

---

## CSS-in-JS Considerations

### CSS Modules (Recommended for Next.js)

```typescript
// components/Card/Card.tsx
import styles from './Card.module.css';

interface CardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlighted';
}

export function Card({ title, children, variant = 'default' }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

// Card.module.css
.card {
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.highlighted {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.content {
  color: #4b5563;
}
```

### Tailwind CSS

```typescript
// components/Card/Card.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white',
        highlighted: 'border-blue-500 bg-blue-50',
        destructive: 'border-red-500 bg-red-50',
      },
      size: {
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title: string;
}

export function Card({
  title,
  children,
  variant,
  size,
  className,
  ...props
}: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, size }), className)} {...props}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="text-gray-600">{children}</div>
    </div>
  );
}
```

### Styled Components (Client Components Only)

```typescript
// components/Card/Card.tsx
'use client';

import styled from 'styled-components';

const StyledCard = styled.div<{ $highlighted?: boolean }>`
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.$highlighted ? '#3b82f6' : '#e5e7eb'};
  background-color: ${props => props.$highlighted ? '#eff6ff' : '#fff'};
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

interface CardProps {
  title: string;
  children: React.ReactNode;
  highlighted?: boolean;
}

export function Card({ title, children, highlighted }: CardProps) {
  return (
    <StyledCard $highlighted={highlighted}>
      <Title>{title}</Title>
      <div>{children}</div>
    </StyledCard>
  );
}

// For Next.js, configure registry in layout
// lib/registry.tsx
'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
```

### CSS-in-JS Comparison

```yaml
css_strategies:
  css_modules:
    pros:
      - Zero runtime overhead
      - Works with Server Components
      - Built into Next.js
      - True CSS (full feature support)
    cons:
      - Separate file per component
      - No dynamic styles (use CSS vars)
    recommendation: "Default choice for Next.js"

  tailwind:
    pros:
      - Rapid development
      - No runtime overhead
      - Works with Server Components
      - Consistent design system
    cons:
      - Verbose class names
      - Learning curve
      - Potential for large HTML
    recommendation: "Excellent for design systems"

  styled_components:
    pros:
      - Dynamic styles
      - Co-located styles
      - TypeScript support
    cons:
      - Runtime overhead
      - Client Components only
      - SSR complexity
    recommendation: "Use sparingly, Client Components only"

  css_in_js_server_components:
    warning: |
      CSS-in-JS libraries that require runtime (styled-components,
      emotion) are NOT compatible with Server Components.
      Use CSS Modules or Tailwind for Server Components.
```

---

## State Management

### React Query for Server State

```typescript
// lib/queries/users.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, createUser, User, CreateUserInput } from '@/lib/api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Zustand for Client State

```typescript
// stores/ui.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
```

---

## Code Review Rules

### React-Specific Rules

```yaml
review_react:
  component_design:
    - "Single responsibility principle"
    - "Props should be minimal and focused"
    - "Prefer composition over inheritance"
    - "Use TypeScript for all components"

  hooks_rules:
    - "Follow Rules of Hooks"
    - "Custom hooks start with 'use'"
    - "Memoize expensive computations"
    - "Clean up effects properly"

  performance:
    - "Use React.memo for pure components"
    - "Use useMemo/useCallback appropriately"
    - "Avoid inline object/function props"
    - "Virtualize long lists"

  accessibility:
    - "Semantic HTML elements"
    - "ARIA attributes where needed"
    - "Keyboard navigation support"
    - "Focus management"
```

### Next.js-Specific Rules

```yaml
review_nextjs:
  server_vs_client:
    - "Default to Server Components"
    - "Use 'use client' only when necessary"
    - "Minimize client bundle size"

  data_fetching:
    - "Fetch data in Server Components"
    - "Use Server Actions for mutations"
    - "Implement proper caching strategies"

  routing:
    - "Use route groups for organization"
    - "Implement loading and error states"
    - "Generate metadata for SEO"
```

---

## Commands

```bash
# Component generation
/react component <name>                  # Create component
/react component <name> --client         # Create client component
/react component <name> --with-test      # Create with test file
/react component <name> --with-story     # Create with Storybook

# Next.js specific
/nextjs page <path>                      # Create page
/nextjs layout <path>                    # Create layout
/nextjs action <name>                    # Create Server Action
/nextjs api <path>                       # Create API route

# Testing
/react test                              # Run all tests
/react test --coverage                   # Run with coverage
/react test --watch                      # Watch mode
/react test <component>                  # Test specific component

# Development
/react dev                               # Start dev server
/react build                             # Production build
/react lint                              # Run ESLint
```

---

## Configuration

```yaml
# config/react_nextjs.yaml
react_nextjs:
  enabled: true

  component:
    default_type: server    # server or client
    styling: tailwind       # tailwind, css-modules, styled-components
    testing: true
    storybook: false

  nextjs:
    version: 14
    router: app             # app or pages
    typescript: true
    src_directory: false

  testing:
    framework: jest
    coverage_threshold: 80
    test_utils: "@testing-library/react"

  styling:
    css_in_js_warning: true  # Warn about runtime CSS-in-JS
    tailwind_config: tailwind.config.ts

  lint:
    eslint_config: .eslintrc.json
    prettier: true

  review:
    accessibility: required
    server_components: preferred
    performance: strict
```

---

*Modern React and Next.js development with performance and developer experience.*
