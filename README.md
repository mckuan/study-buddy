# Study Buddy 🐱

A cozy desktop productivity companion that combines focus sessions, website blocking, daily task management, and shared study rooms with an animated virtual cat.

![Study Buddy Screenshot](./screenshots/main-room.png)

## Features

### 🐾 Virtual Study Cat

* Animated desktop cat companion
* Multiple animations and activity states
* Customizable appearance options

### ⏰ Focus Sessions

* Customizable focus timer
* Track focus time and productivity
* Track how much you and your friends are studying

### 🚫 Website Blocking

* Block distracting websites during focus sessions
* Uses system-level hosts file modification
* Secure credential storage through the OS keychain

### 📝 Daily Checklist

* Create and manage daily tasks
* Track completed items
* Persistent storage via electron-store

### 🏠 Shared Study Rooms

* Create and join private study rooms
* Real-time chat
* Live leaderboard updates
* Collaborative study environment

## Tech Stack

### Frontend

* Electron
* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express
* Socket.IO

### Storage & Security

* Electron Store
* Keytar

### Deployment

* GitHub Releases
* Render

## Why I Built This

I wanted a study tool that felt more engaging than a traditional timer or to-do list. Study Buddy combines productivity features with a virtual pet and shared study spaces to make studying feel more rewarding. Along the way, it became my largest software engineering project and a way to explore desktop application development.

## What I Learned

Building Study Buddy taught me how to:

* Design Electron applications using main processes, renderer processes, and preload scripts
* Build secure IPC communication between application layers
* Implement Electron security best practices including context isolation and restricted APIs
* Work with operating system features such as the hosts file, system permissions, and secure credential storage
* Build real-time multiplayer systems using Socket.IO
* Apply server-side validation, sanitization, rate limiting, and CORS protections
* Manage persistent application state and user settings
* Package and distribute desktop applications through GitHub Releases

## Installation

### macOS

1. Download the latest `.dmg` from the Releases page.
2. Move Study Buddy into your Applications folder.
3. Launch the application.

### Important Notes

**Render Free Tier**

The multiplayer server is hosted on Render's free tier. The first connection to a study room may take 30–60 seconds while the server wakes up.

**macOS Security Warning**

Study Buddy is currently not Apple code-signed or notarized.

If macOS prevents the application from opening:

1. Right-click the application.
2. Select **Open**.
3. Confirm that you want to run the application.

## Future Plans

* Additional cat varieties
* Animated cats inside shared study rooms
* Shared music support in study rooms
* Automatic rollover of unfinished tasks to the next day
* Weather-connected room window
* Improved onboarding experience
* Additional room interactions and collectibles

## Screenshots

### Main Room

(Add screenshot)

### Focus Timer

(Add screenshot)

### Shared Study Room

(Add screenshot)


