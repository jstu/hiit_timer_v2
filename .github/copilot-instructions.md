# HIIT Timer App Project Instructions

This is a React + TypeScript + Next.js HIIT timer application with the following features:
- Interactive timer with work/rest intervals
- Audio notifications and sound effects
- Progress visualization
- Customizable workout settings
- Preset management and workout history
- Responsive design with modern UI

## Project Structure
- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/src/hooks` - Custom React hooks for timer logic
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions
- `/public/audio` - Audio files for timer sounds

## Key Features
- Timer states: prepare, active (work), rest
- Audio cues: start/end sounds, halfway alerts, 30-second burn alerts
- Settings persistence via localStorage
- Progress tracking and workout history
- Mobile-responsive design with Tailwind CSS