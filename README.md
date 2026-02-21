# Prompt Manager PWA

A mobile-first Progressive Web Application for managing prompts with click-to-copy functionality.

## Features

- **Two-Column Layout**: Grid of prompt squares on the left, preview panel on the right
- **Click-to-Copy**: Single click on any card copies the prompt to clipboard
- **Preview Mode**: Shift+Click to select a prompt for preview in the second column
- **Add/Edit/Delete**: Full CRUD operations for managing prompts
- **Search**: Real-time search through titles and descriptions
- **Dark/Light Mode**: System preference detection with manual toggle
- **PWA Support**: Installable on mobile devices with offline support
- **Mobile-First Design**: Responsive layout optimized for mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd prompt-manager
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Adding a Prompt
1. Click the **+** button (floating action button on mobile, or in header on desktop)
2. Enter a title and description
3. Choose a color for the card
4. Click **Save Prompt**

### Copying a Prompt
- **Single click** on any prompt card to copy its description to clipboard
- A toast notification will confirm the copy action

### Previewing a Prompt
- **Shift+Click** on a card to select it for preview
- The prompt will appear in the preview panel (right column on desktop, bottom panel on mobile)
- From the preview, you can copy, edit, or delete the prompt

### Editing a Prompt
1. Select a prompt for preview (Shift+Click)
2. Click the **Edit** button in the preview panel
3. Modify the title, description, or color
4. Click **Save Changes**

### Deleting a Prompt
1. Select a prompt for preview (Shift+Click)
2. Click the **Delete** button in the preview panel
3. Confirm the deletion

### Searching
- Use the search bar in the header to filter prompts
- Search works on both title and description

### Theme Toggle
- Click the sun/moon icon in the header to toggle between light and dark mode
- The app respects your system preference by default

## PWA Installation

### On Mobile (iOS/Android)
1. Open the app in your mobile browser
2. For iOS: Tap the Share button → "Add to Home Screen"
3. For Android: Tap the menu button → "Add to Home Screen" or "Install App"

### On Desktop (Chrome/Edge)
1. Look for the install icon in the address bar
2. Click "Install" when prompted

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **vite-plugin-pwa** for PWA support
- **Lucide React** for icons
- **localStorage** for data persistence

## Project Structure

```
prompt-manager/
├── public/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
├── src/
│   ├── components/
│   │   ├── AddPromptModal/
│   │   ├── EditPromptModal/
│   │   ├── FloatingActionButton/
│   │   ├── PromptCard/
│   │   ├── PromptGrid/
│   │   ├── PromptPreview/
│   │   ├── SearchBar/
│   │   ├── ThemeToggle/
│   │   └── Toast/
│   ├── context/
│   │   ├── PromptContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   ├── models/
│   │   └── Prompt.ts
│   ├── services/
│   │   └── storageService.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── index.html
├── vite.config.ts
└── package.json
```

## License

MIT
