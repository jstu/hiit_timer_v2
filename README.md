# HIIT Timer v2

A modern React + TypeScript + Next.js HIIT (High-Intensity Interval Training) timer application with advanced features and responsive design.

## Features

- **Interactive Timer**: Work/rest interval timing with visual progress tracking
- **Audio Notifications**: Sound effects for round transitions, halfway points, and alerts
- **Customizable Workouts**: Adjustable work time, rest time, and cycle count
- **Smart Alerts**: 30-second burn alerts and random motivational jump sounds
- **Settings Persistence**: Your preferences are saved automatically
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, dark theme with Tailwind CSS styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Main timer page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── TimerDisplay.tsx    # Main timer display
│   ├── StatusDisplay.tsx   # Status and round info
│   ├── TimerControls.tsx   # Start/pause/reset buttons
│   ├── ProgressBar.tsx     # Visual progress indicator
│   └── WorkoutSettings.tsx # Settings panel
├── hooks/              # Custom React hooks
│   └── useTimer.tsx    # Timer logic and state management
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
└── utils/              # Utility functions
    ├── audioManager.ts # Audio playback management
    └── index.ts        # Storage and helper functions
```

## Usage

1. **Configure your workout**: Set work time, rest time, and number of cycles
2. **Enable/disable features**: Toggle 30-second burn alerts and jump sounds
3. **Start your workout**: Click "Start" to begin with a 10-second preparation
4. **Follow the timer**: Visual and audio cues guide you through work and rest periods
5. **Track progress**: The progress bar shows overall workout completion

## Audio Files

Place your audio files in `public/audio/` directory:

- `end-sound1.mp3` - Round end sound (variation 1)
- `end-sound2.mp3` - Round end sound (variation 2) 
- `end-sound3.mp3` - Round end sound (variation 3)
- `select_denied.mp3` - Countdown sound (3-2-1)
- `ding_arcade.mp3` - Halfway point notification
- `fog_horn.mp3` - 30-second burn alert
- `mario.mp3` - Random motivational sound

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Context** - State management for timer logic
- **localStorage** - Settings persistence

## License

MIT License - feel free to use this project for your own HIIT workouts!
