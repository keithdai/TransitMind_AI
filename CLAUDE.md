# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TransitMind AI** is an Agent-Native Transportation Government Affairs Intelligent Agent Operating System Frontend. This is currently in the specification/design phase - the project contains only a design document, no implementation code exists yet.

## Planned Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Mocking**: MSW (Mock Service Worker)

## Core Functional Modules

### 1. Dashboard (智能交互中枢)
Central hub with:
- Proactive agent push system
- Natural language input
- Agent matrix view
- Todo cards

### 2. AgentWorkflow (多智能体协同可视化)
Multi-agent collaboration visualization with:
- 5 agent types: Coordinator/Analyzer/Optimizer/Validator/Executor
- Dynamic node glow effects
- Data flow line animations
- Real-time workflow control

### 3. AgentSpace (沉浸式智能体空间)
Immersive agent workspace with three-column layout:
- Control panel
- Conversation/edit area
- Tools area
- Multi-turn dialogue interaction
- Real-time document editing
- Task progress tracking

### 4. AgentMarketplace (智能体市场)
Agent marketplace featuring:
- Categories: Planning/Compliance/Project/Emergency/Data
- One-click subscribe/unsubscribe
- Ratings and comments
- Usage statistics

## Design System

### Color Palette
- **Primary**: Deep Space Blue `#002B5B` + Aurora Cyan `#00E0FF`
- **Accent**: Agent Purple `#7B61FF`, Compliance Green `#00C48C`
- **Background**: Deep Space Gray `#121A29`

### Visual Effects
- Node glow/breathing effects
- Data flow line animations
- Frosted glass semi-transparent panels
- Gradient glowing borders

## Development Commands (Once Implemented)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Run tests (when added)
npm test
```

## Architecture Notes

The application follows a modular architecture with four main feature modules:
- Dashboard serves as the main entry point and command center
- AgentWorkflow provides visual workflow orchestration
- AgentSpace offers deep work environments for individual agents
- AgentMarketplace enables agent discovery and subscription

Each module should be self-contained with its own routing, state management, and components. The design emphasizes a futuristic, sci-fi aesthetic with dark themes and animated elements throughout.