# Study Buddy 

A cozy desktop productivity companion that combines focus sessions, website blocking, daily task management, and shared study rooms with an animated virtual cat.

<img width="976" height="696" alt="Screen Recording 2026-06-02 at 9" src="https://github.com/user-attachments/assets/c982bf88-e319-496d-bd48-85899dc4e729" />

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

1. Download the latest `.dmg` from the Releases page => https://github.com/mckuan/study-buddy/releases/tag/v0.9.0
3. Move Study Buddy into your Applications folder.
4. Launch the application.

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


### Welcome

<img width="532" height="392" alt="Screenshot 2026-06-02 at 10 54 52 PM" src="https://github.com/user-attachments/assets/34ac9d33-82d9-48a2-b26d-686b94df5cb3" />

### Main Room

<img width="532" height="392" alt="Screenshot 2026-06-02 at 10 58 24 PM" src="https://github.com/user-attachments/assets/8236a533-5bb6-4df0-934d-99c38f369da4" />

### Checklist

<img width="663" height="256" alt="Screenshot 2026-06-02 at 10 52 24 PM" src="https://github.com/user-attachments/assets/05184f2e-cf11-47aa-a413-a4ec76f28fa3" />

### Focus Timer

<img width="532" height="392" alt="Screenshot 2026-06-02 at 10 51 56 PM" src="https://github.com/user-attachments/assets/a793c83a-77bd-44f0-a556-abdb569c60b7" />

### Settings

<img width="532" height="392" alt="Screenshot 2026-06-02 at 10 52 37 PM" src="https://github.com/user-attachments/assets/7431166b-6597-4829-a8cd-be205845c3a2" />

### Shared Study Room

<img width="532" height="392" alt="Screenshot 2026-06-02 at 10 52 41 PM" src="https://github.com/user-attachments/assets/8a7a6853-73d0-4aa2-b830-e84679b33fdd" />

<img width="512" height="362" alt="Screenshot 2026-06-02 at 10 55 21 PM" src="https://github.com/user-attachments/assets/37137ac5-19cb-4983-8335-cd5da8679c90" />

### Chat

<img width="512" height="362" alt="Screenshot 2026-06-02 at 10 55 39 PM" src="https://github.com/user-attachments/assets/aee1be50-47a0-416d-8f5a-91e84ed986c8" />

### Focus and Leaderboard

<img width="512" height="362" alt="Screenshot 2026-06-02 at 10 55 31 PM" src="https://github.com/user-attachments/assets/5d531223-6a79-4220-983f-98c7283cc580" />
