# Study Buddy Cat

A desktop study companion that combines website blocking, a virtual pet cat, and a shared study room experience to help users stay focused while studying.

## Features

* Website blocking during study sessions
* Animated desktop cat companion
* Study room environment
* Timer-based focus sessions
* Customizable cat selection
* Desktop overlay experience

---

## Current Bugs

### Password Verification Instability

The password verification system used for website blocking is currently unstable. This can occasionally result in inconsistent blocking behavior across websites and may allow or prevent access unexpectedly.

### Always-On-Top Preference Persistence

The application's "Always On Top" setting is not consistently saved between sessions. Users may experience different behavior after restarting the application.

---

## What's Next

### Welcome Page

Create a first-time setup experience that allows users to:

* Enter their name
* Select their preferred cat companion
* Configure initial preferences

### Shared Study Room Animations

Implement synchronized animations within the study room environment so that cats can interact and move naturally while users study together.

### Server Deployment

Move the backend off localhost and deploy it to a hosted environment for easier access and improved scalability.

### Post-Deployment Testing

Conduct additional testing of the study room system after deployment to identify synchronization, networking, and usability issues.

### Additional Improvements

* Bug fixes and stability improvements
* UI polish and onboarding improvements
* Expanded customization options
* Performance optimization

---

## Running the Project

### Start the Backend

```bash
cd server
node server.js
```

### Start the Frontend

In a separate terminal:

```bash
npm start
```

---

## Tech Stack

* Electron
* JavaScript
* Node.js
* Express
* Socket-based real-time communication

---

## Development Status

This project is currently under active development. Core functionality is implemented, and current work is focused on improving stability, onboarding, deployment, and collaborative study room features.
