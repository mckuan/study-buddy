# Study Buddy

A cozy desktop productivity companion built with Electron.

Study Buddy is designed to make studying feel calmer, more intentional, and less overwhelming through a relaxing desktop experience focused on focus sessions, task organization, and distraction reduction.

---

# Preview

## Main Workspace

* Cozy transparent desktop interface
* Lightweight floating window design
* Custom productivity-focused UI
* Designed around relaxing study aesthetics

## Checklist Window

* Persistent multi-day task management
* Date-based organization system
* Independent task storage for each day
* Fast lightweight workflow

---

# Features

## Multi-Day Task Planning

* Plan tasks up to 5 days in advance
* Quickly switch between dates
* Separate checklist data for each day
* Automatically loads today's tasks by default

## Persistent Checklist System

* Tasks persist between sessions
* Completion state is saved automatically
* Local storage system for lightweight persistence
* Designed for fast everyday usage

## Website Blocking System

* Experimental focus mode website blocker
* Host-file based blocking implementation
* Temporary distraction reduction workflow
* Built using Node.js child process execution

## Desktop Application Architecture

Built with Electron using:

* Main / renderer process architecture
* IPC communication
* Frameless transparent windows
* Persistent window state
* Native desktop behaviors
* Multiple application windows

## Cozy Productivity UI

* Relaxed visual design
* Transparent desktop windows
* Minimal interface clutter
* Soft productivity-focused atmosphere
* Inspired by cozy study spaces and ambient productivity apps

---

# Tech Stack

## Core Technologies

* Electron
* JavaScript
* HTML
* CSS
* Node.js

## Libraries & Packages

* electron-window-state
* electron-store
* keytar

---

# Project Goals

Study Buddy started as a personal learning project and is gradually evolving into a larger productivity platform.

The long-term goal is to create a study environment that feels:

* calming instead of overwhelming
* personal instead of corporate
* visually motivating
* lightweight and distraction-free

Rather than functioning as only a task manager, the app is intended to feel more like a desktop study companion.

---

# Planned Features

## Focus Timer System

* Pomodoro timer
* Focus / break cycles
* Session tracking
* Focus statistics
* Study hour analytics

## Collaborative Study Rooms

* Joinable room codes
* Shared focus sessions
* Real-time room synchronization
* Friends appearing in workspace environments

## Productivity Analytics

* Focus streaks
* Weekly summaries
* Time tracking
* Completed task analytics

## Personalization

* Themes
* Custom backgrounds
* Ambient sounds
* Customizable workspace layouts

## Future Expansion

* Cloud synchronization
* Cross-device syncing
* Calendar integration
* AI study assistant concepts

---

# Architecture Notes

Current architecture includes:

```txt
study-buddy/
├── main.js
├── render.js
├── checklist-render.js
├── hosts.js
├── index.html
├── checklist.html
├── package.json
└── assets
```

The project is currently being refactored toward a more modular structure as development continues.

---

# Installation

## Clone Repository

```bash
git clone <repo-url>
cd study-buddy
```

## Install Dependencies

```bash
npm install
```

## Run Application

```bash
npm start
```

---

# Current Development Focus

The current development phase is focused on:

* improving application architecture
* expanding productivity systems
* improving state management
* polishing desktop UX
* modularizing the codebase
* improving Electron security practices

---

# What I Learned From This Project

Study Buddy is my first major long-term software project while learning JavaScript and desktop application development.

Through building this application, I have been learning:

* Electron desktop architecture
* Main vs renderer processes
* IPC communication systems
* DOM manipulation
* State management
* Persistent storage systems
* Multi-window application design
* Async JavaScript workflows
* File system interactions
* OS-level process execution
* UI/UX focused design thinking
* Software project organization
* Iterative product development

This project is being developed incrementally as both:

* a learning experience
* a long-term portfolio project
* an exploration of productivity software design

---

# Why I Built This

A lot of productivity software feels overly corporate, cluttered, or stressful.

I wanted to build something that feels softer and more motivating — a study environment that people actually enjoy opening every day.

Study Buddy combines:

* productivity tools
* cozy visual design
* desktop utility features
* lightweight workflows

into a more personal studying experience.

---

# Current Status

Currently in active development.

This project is still evolving rapidly and many systems are experimental or being redesigned as I continue learning and improving the application.

---

# Future Improvements

Planned technical improvements include:

* cleaner modular architecture
* preload-based Electron security improvements
* improved persistence systems
* better performance optimization
* packaged desktop builds
* automated testing
* scalable state management

---

# License

MIT License
