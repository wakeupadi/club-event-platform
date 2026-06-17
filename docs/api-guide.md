# REST API & Server Actions Guide - EventHub

This guide details the endpoints and Server Actions driving the backend logic of EventHub.

---

## 🔌 REST API Endpoints

### 👤 Role Management
- **`GET /api/role`**
  - **Description**: Retrieves the active cookie mode (e.g. `student` or `club`).
  - **Response**: `{"role": "student"}`
- **`POST /api/role`**
  - **Description**: Sets the active mode cookie (`active-role`).
  - **Payload**: `{"role": "club"}`
  - **Response**: `{"success": true, "role": "club"}`

### 📂 Clubs & Users Directories
- **`GET /api/clubs`**
  - **Description**: Returns all registered clubs in alphabetical order.
  - **Response**: `{"success": true, "clubs": [{"id": "...", "name": "..."}]}`
- **`GET /api/users`**
  - **Description**: Returns all registered users in alphabetical order.
  - **Response**: `{"success": true, "users": [{"id": "...", "name": "...", "points": 0}]}`

### 🤝 Club Collaboration Suggester
- **`POST /api/collab`**
  - **Description**: Calculates the top 3 recommended clubs to collaborate with based on student RSVP audience overlap.
  - **Payload**: `{"clubId": "target-club-id"}`
  - **Response**:
    ```json
    {
      "success": true,
      "suggestions": [
        {
          "id": "other-club-id",
          "name": "Google Developer Club",
          "score": 2,
          "reason": "Shares 2 active students with your audience."
        }
      ]
    }
    ```

---

## ⚡ Server Actions (RPCs)

Server actions are located under `app/actions/`.

### 📅 `suggestBestDates()`
- **Logic**: Iterates over the next 45 calendar days.
- **Normalizations**: Wiped-clear string comparisons done relative to `Asia/Kolkata` local timezone to prevent UTC offsets.
- **Rules applied**:
  1. **Blackout Disqualification**: Disqualifies dates that intersect with university exams/holidays from the `AcademicCalendar` table.
  2. **Double Booking Penalization**: Reduces the date score by `20 points` for each clashing campus event.
  3. **Weekend Bonus**: Appends `+20 points` for Friday and Saturday slots.
- **Output**: Returns the top 3 optimal recommended dates.

### ✍️ `createEventAction(formData: FormData)`
- **Logic**: Combines dates and times using India's offset (`+05:30`) to record exact local timestamps.
- **Validation**: Enforces a campus-wide 2-hour minimum separation between events. Conflicts return a detailed error stating which club event clashing within the window.

### 👥 `rsvpToEvent(eventId: string)`
- **Logic**: Records a unique RSVP bridge link between the active student session and the target event.
- **Gamification**: Awards the student `+10 points` upon registration.
