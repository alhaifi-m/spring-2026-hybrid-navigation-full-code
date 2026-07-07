# React Native Navigation Guide (Expo Router)

## A Senior Architect's Walkthrough for Junior Engineers

---

## Table of Contents

1. [The Big Picture](#the-big-picture)
2. [What is File-Based Routing?](#what-is-file-based-routing)
3. [Project File Structure](#project-file-structure)
4. [The Two Types of Navigation](#the-two-types-of-navigation)
5. [How It All Connects — Full Architecture Diagram](#full-architecture-diagram)
6. [Mind Map — How to Teach This](#mind-map)
7. [Step-by-Step: How a User Moves Through the App](#user-flow)
8. [The `_layout.tsx` Files — The Secret Sauce](#layout-files)
9. [Dynamic Routes — The `[id]` Pattern](#dynamic-routes)
10. [Quick Reference Cheat Sheet](#cheat-sheet)

---

## The Big Picture <a name="the-big-picture"></a>

Think of your app like a **building**:

```
+================================================================+
|                        YOUR APP (Building)                      |
|================================================================|
|                                                                 |
|   STACK NAVIGATION = The Elevator                               |
|   Goes UP (push) and DOWN (pop) between floors                  |
|   Example: Courses List --> Course Details                      |
|                                                                 |
|   TAB NAVIGATION = The Hallways on each floor                   |
|   Move LEFT and RIGHT between rooms                             |
|   Example: Home | Courses | Settings                            |
|                                                                 |
+================================================================+
```

### Key Insight: Nested Navigation (Navigators Inside Navigators)

This app has **3 navigators**, and they are **nested inside each other** like Russian dolls:

```
LAYER 1 — The Outer Box (app/_layout.tsx)
╔══════════════════════════════════════════════════════════════╗
║  STACK NAVIGATOR (Root)                                      ║
║  This is the outermost container. Everything lives inside it.║
║                                                              ║
║  LAYER 2 — Inside the Stack (app/(tab)/_layout.tsx)          ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │  TAB NAVIGATOR                                         │  ║
║  │  The tab bar at the bottom with 3 tabs.                │  ║
║  │                                                        │  ║
║  │   Tab 1: Home        Tab 2: Courses    Tab 3: Settings │  ║
║  │   (just a screen)    (has its OWN      (just a screen) │  ║
║  │                       navigator!)                      │  ║
║  │                                                        │  ║
║  │                      LAYER 3 — Inside the Courses tab  │  ║
║  │                      (app/(tab)/courses/_layout.tsx)   │  ║
║  │                      ┌──────────────────────┐          │  ║
║  │                      │  STACK NAVIGATOR     │          │  ║
║  │                      │  (Courses)           │          │  ║
║  │                      │                      │          │  ║
║  │                      │  - Courses List      │          │  ║
║  │                      │       |              │          │  ║
║  │                      │       v (push)       │          │  ║
║  │                      │  - Course Details    │          │  ║
║  │                      └──────────────────────┘          │  ║
║  │                                                        │  ║
║  └────────────────────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════╝
```

**Why does this matter?** Each navigator only controls **its own children**:

- The **Root Stack** (Layer 1) doesn't know about individual courses — it just sees "there's a tab group inside me"
- The **Tab Navigator** (Layer 2) doesn't know about course details — it just sees "there's a Courses section"
- The **Courses Stack** (Layer 3) handles the push/pop between the course list and course details

**Think of it this way:**
- Layer 1 (Root Stack) = The **building** — it holds everything
- Layer 2 (Tabs) = The **floor plan** — you walk between rooms (Home, Courses, Settings)
- Layer 3 (Courses Stack) = A **room with stairs** — inside the Courses room, you can go up to see details and come back down

This pattern of putting navigators inside other navigators is called **nested navigation**, and it's how most real-world apps are built.

---

## What is File-Based Routing? <a name="what-is-file-based-routing"></a>

Expo Router uses **file-based routing** — the folder and file names inside `app/` **become** your routes automatically.

```
 FILE YOU CREATE                         URL / ROUTE IT CREATES
 ──────────────────                      ──────────────────────
 app/index.tsx                    -->    /
 app/(tab)/home.tsx               -->    /(tab)/home
 app/(tab)/settings.tsx           -->    /(tab)/settings
 app/(tab)/courses/index.tsx      -->    /(tab)/courses
 app/(tab)/courses/[id].tsx       -->    /(tab)/courses/cprg216
                                         /(tab)/courses/cprg303
                                         /(tab)/courses/anything
```

**Rules to remember:**
- `_layout.tsx` = Defines HOW screens are arranged (Stack? Tabs?) — never a screen itself
- `index.tsx` = The default/home screen of that folder
- `[id].tsx` = A dynamic route — `id` can be ANY value
- `(tab)/` = A **group** — the parentheses mean this folder name does NOT appear as part of the URL path concept (it's organizational)

---

## Project File Structure <a name="project-file-structure"></a>

```
full-navigation/
│
├── app/                              <-- ALL routing lives here
│   ├── _layout.tsx                   <-- ROOT layout (Stack Navigator)
│   ├── index.tsx                     <-- Entry point (redirects to home)
│   │
│   └── (tab)/                        <-- Tab group (parentheses = group)
│       ├── _layout.tsx               <-- TAB layout (Tab Navigator)
│       ├── home.tsx                  <-- Tab 1: Home screen
│       ├── settings.tsx              <-- Tab 3: Settings screen
│       │
│       └── courses/                  <-- Nested folder = nested navigation
│           ├── _layout.tsx           <-- STACK layout (inside Courses tab)
│           ├── index.tsx             <-- Courses list screen
│           └── [id].tsx              <-- Course detail (dynamic route)
│
├── components/
│   └── AppCard.tsx                   <-- Reusable UI component
│
├── styles/
│   └── theme.ts                     <-- Design tokens (colors, spacing)
│
└── package.json                      <-- Dependencies
```

### What each file does:

| File | Role | Navigation Type |
|------|------|----------------|
| `app/_layout.tsx` | Wraps the entire app in a **Stack** | Stack (Root) |
| `app/index.tsx` | Redirects `/` to `/(tab)/home` | Redirect |
| `app/(tab)/_layout.tsx` | Creates the **bottom tab bar** | Tabs |
| `app/(tab)/home.tsx` | Home dashboard screen | Tab Screen |
| `app/(tab)/settings.tsx` | Settings screen | Tab Screen |
| `app/(tab)/courses/_layout.tsx` | Creates a **Stack** inside the Courses tab | Stack (Nested) |
| `app/(tab)/courses/index.tsx` | Courses list screen | Stack Screen |
| `app/(tab)/courses/[id].tsx` | Course detail screen (dynamic) | Stack Screen |

---

## The Two Types of Navigation <a name="the-two-types-of-navigation"></a>

### 1. Stack Navigation (Vertical — like a stack of cards)

```
    +---------------------------+
    |     Course Details        |  <-- Screen 2 (pushed ON TOP)
    |     (courses/[id].tsx)    |
    |                           |
    |         [  <  Back  ]     |  <-- Back button pops this screen off
    +---------------------------+
    |     Courses List          |  <-- Screen 1 (stays underneath)
    |     (courses/index.tsx)   |
    |                           |
    +---------------------------+

    PUSH  = Add a new screen on top     (go forward)
    POP   = Remove the top screen       (go back)
```

**When to use Stack:** When the user is drilling deeper into content (list --> detail --> sub-detail).

**In our code** (`app/(tab)/courses/_layout.tsx`):
```tsx
import { Stack } from "expo-router";

export default function CoursesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Courses" }} />
      <Stack.Screen name="[id]" options={{ title: "Course Details" }} />
    </Stack>
  );
}
```

---

### 2. Tab Navigation (Horizontal — like switching TV channels)

```
    +------------------------------------------------+
    |                                                |
    |              SCREEN CONTENT                    |
    |           (changes per tab)                    |
    |                                                |
    |                                                |
    +------------------------------------------------+
    |   [  Home  ]   [ Courses ]   [ Settings ]      |  <-- Tab Bar
    |      ^               ^             ^           |
    |   home.tsx    courses/         settings.tsx    |
    +------------------------------------------------+

    All screens exist side by side.
    Tapping a tab SWITCHES — it doesn't push or pop.
```

**When to use Tabs:** When the user is switching between top-level sections of your app.

**In our code** (`app/(tab)/_layout.tsx`):
```tsx
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: ... }} />
      <Tabs.Screen name="courses" options={{ title: "Courses", tabBarIcon: ... }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ... }} />
    </Tabs>
  );
}
```

---

## Full Architecture Diagram <a name="full-architecture-diagram"></a>

```
+=======================================================================+
|                         app/_layout.tsx                                |
|                     ROOT STACK NAVIGATOR                              |
|                  (wraps everything, header hidden)                    |
+=======================================================================+
         |
         |  contains
         v
+=======================================================================+
|                       app/(tab)/_layout.tsx                           |
|                       TAB NAVIGATOR                                   |
|                                                                       |
|   +------------------+  +-------------------+  +------------------+   |
|   |                  |  |                   |  |                  |   |
|   |   TAB 1: Home    |  |  TAB 2: Courses   |  |  TAB 3: Settings |   |
|   |                  |  |                   |  |                  |   |
|   |   home.tsx       |  |  courses/         |  |  settings.tsx    |   |
|   |                  |  |  _layout.tsx      |  |                  |   |
|   |  +------------+  |  |  (Stack Nav)      |  |  +------------+  |   |
|   |  | Dashboard  |  |  |                   |  |  | Notif.     |  |   |
|   |  | - Deadline |  |  |  +-------------+  |  |  | Toggle     |  |   |
|   |  | - Attend.  |  |  |  | index.tsx   |  |  |  | Account    |  |   |
|   |  +------------+  |  |  | Course List |  |  |  +------------+  |   |
|   |                  |  |  +------+------+  |  |                  |   |
|   |                  |  |         |         |  |                  |   |
|   |                  |  |    push | pop     |  |                  |   |
|   |                  |  |         v         |  |                  |   |
|   |                  |  |  +-------------+  |  |                  |   |
|   |                  |  |  | [id].tsx    |  |  |                  |   |
|   |                  |  |  | Course      |  |  |                  |   |
|   |                  |  |  | Details     |  |  |                  |   |
|   |                  |  |  +-------------+  |  |                  |   |
|   |                  |  |                   |  |                  |   |
|   +------------------+  +-------------------+  +------------------+   |
|                                                                       |
|   [      Home      ]  [     Courses     ]  [     Settings     ]       |
|   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~        |
|                         BOTTOM TAB BAR                                |
+=======================================================================+
```

### Navigation Flow Arrows

```
    User opens app
         |
         v
    app/index.tsx  ----REDIRECT---->  /(tab)/home
                                          |
                            +-------------+-------------+
                            |             |             |
                          [Home]      [Courses]    [Settings]
                            |             |             |
                         (static)     (has Stack)    (static)
                                          |
                                    Courses List
                                     index.tsx
                                          |
                                     tap a course
                                          |
                                    router.push()
                                          |
                                          v
                                    Course Details
                                      [id].tsx
                                          |
                                     press Back
                                          |
                                          v
                                    Courses List
                                     (popped back)
```

---

## Mind Map — How to Teach This <a name="mind-map"></a>

```
                          +===========================+
                          |   REACT NATIVE ROUTING    |
                          |     (Expo Router)         |
                          +============+==============+
                                       |
              +------------------------+------------------------+
              |                        |                        |
     +--------v--------+    +---------v---------+    +---------v---------+
     | CORE CONCEPT 1  |    |  CORE CONCEPT 2   |    |  CORE CONCEPT 3   |
     | File-Based       |    |  Navigation Types  |    |  _layout.tsx      |
     | Routing           |    |                    |    |  Files             |
     +--------+---------+    +---------+----------+    +---------+----------+
              |                        |                         |
     +--------v--------+     +--------+--------+       +--------v--------+
     | Files = Routes  |     |                 |       | Every folder    |
     |                 |     |   +-----------+ |       | CAN have one    |
     | index.tsx = /   |     |   |   STACK   | |       |                 |
     | about.tsx = /   |     |   | (Vertical)| |       | It defines HOW  |
     |     about       |     |   |           | |       | screens in that |
     | [id].tsx =      |     |   | push/pop  | |       | folder are      |
     |     dynamic     |     |   | forward/  | |       | arranged        |
     | (group)/ =      |     |   | back      | |       |                 |
     |     organize    |     |   +-----------+ |       | Stack? Tabs?    |
     +-----------------+     |                 |       | Drawer?         |
                             |   +-----------+ |       +-----------------+
                             |   |   TABS    | |
                             |   | (Horiz.)  | |
                             |   |           | |
                             |   | switch    | |
                             |   | between   | |
                             |   | sections  | |
                             |   +-----------+ |
                             |                 |
                             |   +-----------+ |
                             |   |  NESTING  | |
                             |   |           | |
                             |   | Stack     | |
                             |   | inside    | |
                             |   | a Tab     | |
                             |   +-----------+ |
                             +-----------------+


    TEACHING ORDER (Suggested Flow):
    =================================

    LESSON 1: File-Based Routing Basics
    ├── Create app/index.tsx --> see it at /
    ├── Create app/about.tsx --> see it at /about
    └── KEY TAKEAWAY: "Files become screens"

    LESSON 2: _layout.tsx and Stack Navigation
    ├── Add app/_layout.tsx with <Stack>
    ├── Navigate forward with router.push()
    ├── Navigate back with back button
    └── KEY TAKEAWAY: "Layouts wrap screens, Stack = depth"

    LESSON 3: Tab Navigation
    ├── Create (tab)/ folder
    ├── Add (tab)/_layout.tsx with <Tabs>
    ├── Add tab screens (home, settings)
    └── KEY TAKEAWAY: "Tabs = top-level sections"

    LESSON 4: Nesting Stack Inside Tabs
    ├── Create courses/ folder inside (tab)/
    ├── Add courses/_layout.tsx with <Stack>
    ├── Add courses/index.tsx and courses/[id].tsx
    └── KEY TAKEAWAY: "You can nest navigators"

    LESSON 5: Dynamic Routes
    ├── Explain [id].tsx naming
    ├── Use router.push() with parameter
    ├── Extract with useLocalSearchParams()
    └── KEY TAKEAWAY: "Square brackets = variable in URL"
```

---

## Step-by-Step: How a User Moves Through the App <a name="user-flow"></a>

```
STEP 1: App Opens
===================
  app/_layout.tsx loads  -->  Creates root Stack
  app/index.tsx loads    -->  <Redirect href="/(tab)/home" />
  Result: User sees the Home tab


STEP 2: User is on Home Tab
==============================
  Screen: app/(tab)/home.tsx
  Shows: "Campus Hub" with deadline & attendance cards
  Tab bar visible at bottom: [Home*] [Courses] [Settings]


STEP 3: User taps "Courses" tab
==================================
  Screen: app/(tab)/courses/index.tsx
  Shows: List of 3 courses (CPRG-216, CPRG-303, CPRG-306)
  Tab bar visible: [Home] [Courses*] [Settings]

  WHAT HAPPENED: Tab navigator switched the active tab.
                 No push/pop — just a horizontal switch.


STEP 4: User taps "CPRG-303"
===============================
  Code runs: router.push("/(tab)/courses/cprg303")
  Screen: app/(tab)/courses/[id].tsx
  Shows: "Course Details" with id = "cprg303"
  Stack header appears with "<  Courses" back button
  Tab bar still visible: [Home] [Courses*] [Settings]

  WHAT HAPPENED: Stack navigator PUSHED [id].tsx on top
                 of index.tsx. The courses list is still
                 there underneath.


STEP 5: User presses Back
============================
  Stack navigator POPS [id].tsx off the stack
  Screen: Back to app/(tab)/courses/index.tsx
  Shows: Course list again

  WHAT HAPPENED: Stack popped. The previous screen was
                 preserved in memory, so it loads instantly.
```

---

## The `_layout.tsx` Files — The Secret Sauce <a name="layout-files"></a>

**Every `_layout.tsx` answers ONE question: "How should the screens in my folder be organized?"**

```
LAYOUT FILE                        QUESTION IT ANSWERS
──────────────────────             ─────────────────────────────────────
app/_layout.tsx                    "How is the ENTIRE app organized?"
                                   Answer: As a Stack (for screen transitions)

app/(tab)/_layout.tsx              "How are the TAB screens organized?"
                                   Answer: As Tabs (bottom tab bar)

app/(tab)/courses/_layout.tsx      "How are COURSE screens organized?"
                                   Answer: As a Stack (list --> detail)
```

### The Nesting Hierarchy:

```
    app/_layout.tsx .................. Stack (Root)
        |
        └── app/(tab)/_layout.tsx ... Tabs
                |
                ├── home.tsx ........ Tab Screen (simple)
                |
                ├── settings.tsx .... Tab Screen (simple)
                |
                └── courses/_layout.tsx .. Stack (Nested)
                        |
                        ├── index.tsx ... Stack Screen (list)
                        |
                        └── [id].tsx .... Stack Screen (detail)
```

**Remember:**
- A `_layout.tsx` is **never** a screen the user sees
- It is the **container** that decides how its children are displayed
- Without a `_layout.tsx`, screens in a folder would have no defined navigation pattern

---

## Dynamic Routes — The `[id]` Pattern <a name="dynamic-routes"></a>

```
FILE NAME:     [id].tsx
                ^  ^
                |  |
                |  └── .tsx = It's a React component
                |
                └── [id] = This part is a VARIABLE

    Think of it like a function parameter:

    STATIC ROUTE:    home.tsx       -->  /home          (always "home")
    DYNAMIC ROUTE:   [id].tsx       -->  /anything      (id = "anything")
                                    -->  /cprg216       (id = "cprg216")
                                    -->  /cprg303       (id = "cprg303")
                                    -->  /42            (id = "42")
```

### How data flows through a dynamic route:

```
    COURSES LIST (index.tsx)                    COURSE DETAILS ([id].tsx)
    ┌─────────────────────┐                     ┌─────────────────────┐
    │                     │                     │                     │
    │  CPRG-216  [>]      │                     │  Course Details     │
    │  CPRG-303  [>]  ----+--- router.push( --->│                     │
    │  CPRG-306  [>]      │  "/(tab)/courses/   │  Course ID:         │
    │                     │   cprg303")         │  ┌───────────┐     │
    └─────────────────────┘                     │  │  cprg303  │     │
                                                │  └───────────┘     │
         SENDING SIDE:                          │                     │
         router.push(                           └─────────────────────┘
           `/(tab)/courses/${item.id}`
         )                                           RECEIVING SIDE:
                                                     const { id } = useLocalSearchParams()
                                                     // id === "cprg303"
```

---

## Quick Reference Cheat Sheet <a name="cheat-sheet"></a>

### Navigation Components

| Component | Import | Purpose |
|-----------|--------|---------|
| `<Stack>` | `expo-router` | Vertical push/pop navigation |
| `<Tabs>` | `expo-router` | Bottom tab bar navigation |
| `<Redirect>` | `expo-router` | Sends user to another route |

### Navigation Functions

| Function | Usage | Example |
|----------|-------|---------|
| `router.push(url)` | Navigate forward (adds to stack) | `router.push("/(tab)/courses/cprg303")` |
| `router.back()` | Go back (pop from stack) | `router.back()` |
| `router.replace(url)` | Replace current screen (no back) | `router.replace("/(tab)/home")` |
| `useLocalSearchParams()` | Get route parameters | `const { id } = useLocalSearchParams()` |

### File Naming Rules

| Pattern | Meaning | Example |
|---------|---------|---------|
| `_layout.tsx` | Navigator definition | `<Stack>` or `<Tabs>` |
| `index.tsx` | Default screen of folder | `/courses` loads `courses/index.tsx` |
| `[param].tsx` | Dynamic route segment | `[id].tsx` matches any value |
| `(name)/` | Route group (organizational) | `(tab)/` groups tab screens |

### The Golden Rules

```
1. Every FOLDER can have a _layout.tsx
2. _layout.tsx defines the NAVIGATOR (Stack, Tabs, Drawer)
3. Other .tsx files in the folder are the SCREENS
4. Folders inside folders = NESTED navigation
5. [brackets] = dynamic URL parameters
6. (parentheses) = organizational groups, not URL segments
```

---

*This guide is based on the `full-navigation` Expo Router project. All file paths and code examples reference the actual codebase.*
