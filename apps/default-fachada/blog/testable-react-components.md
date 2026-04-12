---
title: "Building Testable React Components"
description: "Best practices for writing React components that are easy to test, maintain, and refactor using dependency injection and composition."
date: 2026-02-15
tags: ["React", "Testing", "JavaScript"]
---

## The Testing Problem

We've all written React components that were difficult to test:

```jsx
// Hard to test
function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then(setUser);
  }, []);

  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

Why is this hard to test? The component has hard-coded dependencies and side effects in the render cycle.

## Dependency Injection

Instead, inject dependencies:

```jsx
// Testable version
function UserProfile({ userService }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getUser().then(setUser);
  }, [userService]);

  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

Now in tests:

```jsx
const mockService = {
  getUser: () => Promise.resolve({ name: "Test User" }),
};

render(<UserProfile userService={mockService} />);
```

## Separate Logic from Presentation

Even better, extract business logic into custom hooks:

```jsx
function useUser(userService) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getUser().then(setUser);
  }, [userService]);

  return user;
}

function UserProfile({ userService }) {
  const user = useUser(userService);

  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

Now you can test the hook and the component independently.

## Composition Over Inheritance

React's composition model makes testing easier:

```jsx
function UserProfile({ loading, children }) {
  if (loading) return <div>Loading...</div>;
  return <div>{children}</div>;
}

// In tests
render(<UserProfile loading={false}>Test Content</UserProfile>);
```

## Key Takeaways

1. **Inject dependencies** - Don't hard-code API calls or services
2. **Extract business logic** - Keep components focused on rendering
3. **Use composition** - Pass behavior through props
4. **Test behavior, not implementation** - Focus on what the component does, not how

Following these patterns makes your components not just testable, but also more reusable and maintainable.
