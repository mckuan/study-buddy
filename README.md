# Study Buddy

A cozy desktop productivity app built with Electron focused on helping students stay organized, focused, and motivated while studying.

## Overview

Study Buddy is a desktop application designed around a calming and cozy workspace experience. The app currently includes a multi-day task management system, persistent checklists, multiple desktop windows, and a custom aesthetic UI.

The goal of the project is to evolve into a full study companion platform with:

* task planning
* focus sessions
* website blocking
* collaborative study rooms
* social productivity features

## Current Features

### Multi-Day Task Planning

* Plan tasks up to 5 days in advance
* Today's checklist is shown by default
* Switch between dates using the date selector
* Each day stores its own independent checklist

### Persistent Task System

* Tasks are saved using `localStorage`
* Completed tasks persist between sessions
* Checklist state remains after closing the app

### Desktop App Architecture

Built with Electron using:

* main/renderer process separation
* IPC communication
* frameless transparent windows
* persistent window positions and sizing

### Cozy UI / Visual Design

* Minimal cozy productivity aesthetic
* Transparent desktop windows
* Custom styling and layout
* Inspired by relaxing study environments

## Tech Stack

* Electron
* JavaScript
* HTML
* CSS
* Node.js

## Project Structure

```txt
study-buddy/
├── main.js
├── preload.js
├── renderer.js
├── checklist.js
├── package.json
├── styles/
├── assets/
└── windows/
```

## Current State

This project is currently in active development.

The app is functioning as an early MVP/prototype and is focused on:

* improving productivity workflows
* refining the user experience
* expanding study-focused features
* improving desktop app architecture

## Planned Features

### Focus Timer

* Pomodoro-style study timer
* Focus session tracking
* Break reminders
* Session persistence

### Website Blocking

* Temporary website blocking during study sessions
* Focus mode integration
* Productivity lock system

### Shared Study Rooms

* Join study rooms using room codes
* Friends appear inside your workspace
* Real-time synced study sessions
* Collaborative productivity environment

### Future Ideas

* Study analytics
* Streak tracking
* Ambient sounds
* Themes/customization
* Calendar integration
* Cloud sync

## Installation

```bash
git clone <repo-url>
cd study-buddy
npm install
npm start
```

## Development

Run the application:

```bash
npm start
```

## Skills & Concepts Learned

This is my first major portfolio project while officially learning JavaScript and HTML.

Through building Study Buddy, I have been learning and applying concepts such as:

* Electron desktop app architecture
* Main vs renderer processes
* IPC communication
* Preload security bridges
* DOM manipulation
* DOM synchronization
* State management
* Persistent storage with localStorage
* Multi-window desktop applications
* Dynamic rendering systems
* Event listeners and UI interactions
* Data modeling for scalable features
* Application structure and organization
* User experience focused design
* Real-time architecture planning
* Performance considerations and bottlenecks

The project is being built iteratively as both a learning experience and a long-term portfolio piece.

## Why This Project Exists

A lot of productivity tools feel overly corporate or cluttered.

Study Buddy is designed to feel calmer, more personal, and more motivating — something closer to a cozy digital study companion than a traditional task manager.

## Status

Currently under active development.

Built as an independent learning + portfolio project.
