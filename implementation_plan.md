# Simplified Database Migration Implementation Plan

Based on your requirements, we will keep the MongoDB database structure clean and simple, storing only the specified information. All other UI states (chats, notifications, reviews, and reports) will continue to run on their existing local storage fallback so that the frontend interface remains fully interactive without bloating the database.

---

## Required Dependency
Since we need to hash passwords, we will use `bcryptjs` (a pure JavaScript implementation of bcrypt).
* **Action Required:** Please run the following command in your local terminal:
  ```bash
  npm install bcryptjs
  ```

---

## Proposed MongoDB Schemas (Mongoose)

### 1. User Profile Schema (`User`)
Stores account credentials, profile details, and performance summaries.

* **Collection Name:** `users`
* **Mongoose Schema Design:**
  ```typescript
  import mongoose, { Schema } from 'mongoose';

  const UserSchema = new Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // Hashed using bcryptjs (optional for Google OAuth users)
    name: { type: String, required: true },
    role: { type: String, enum: ['creator', 'professional'], required: true },
    phone: { type: String, default: '' }, // Mobile Number
    country: { type: String, default: '' },
    city: { type: String, default: '' },
    photoUrl: { type: String, default: '' }, // Profile Photo (Base64 or external URL)
    professions: { type: [String], default: [] }, // Cameraman, Videographer, Photographer, Video Editor (if role = professional)
    rating: { type: Number, default: 5.0 }, // Rating
    projectsCompleted: { type: Number, default: 0 } // Total Projects
  });
  ```

### 2. Project Schema (`Project`)
Stores details for collaboration bookings.

* **Collection Name:** `projects`
* **Mongoose Schema Design:**
  ```typescript
  import mongoose, { Schema } from 'mongoose';

  const ProjectSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true }, // Project Title
    date: { type: String, required: true }, // Project Date
    creatorId: { type: String, required: true, index: true }, // Creator ID
    professionalId: { type: String, required: true, index: true } // Professional ID
  });
  ```

---

## REST API Endpoints

We will modify/implement the following routes in `server.ts` to connect the frontend to the database:

### Authentication APIs:
* **`POST /api/auth/register`**: Register a new user profile. If a password is provided, we hash it using `bcryptjs` before inserting into MongoDB.
* **`POST /api/auth/login`**: Authenticate a user via Email + Password. We compare the provided password against the hashed password in MongoDB using `bcryptjs`.
* **`POST /api/auth/google`**: Authenticate or onboard a user via Google OAuth, storing only their Name, Email, and Google profile photoUrl.

### Professional Catalog APIs:
* **`GET /api/professionals`**: Fetch all creative professionals registered in MongoDB.

### Project APIs:
* **`GET /api/projects`**: Retrieve all projects associated with a user (filtered by `?creatorId=...` or `?professionalId=...`).
* **`POST /api/projects`**: Save a new shoot booking project in MongoDB.

---

## Verification Plan

1. Verify server build runs without compilation warnings after adding `bcryptjs`.
2. Register a Creator account via Email + Password and verify the password is encrypted in MongoDB.
3. Sign in via Google OAuth and verify details are saved in the User collection.
4. Create a Project Booking, save it, and verify the record is inserted successfully in MongoDB with only `title`, `date`, `creatorId`, and `professionalId`.
