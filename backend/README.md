# Compass App API

This is an API for the Compass App, which provides access to students educational information.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Endpoints](#endpoints)
  - [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- SQLite

### Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/tone-man/CompassApp
   ```

2. Install dependencies:

   ```shell
   cd backend
   npm install
   ```

3. Set up the environment variables by creating a .env file and providing the required values: (???)

   ```.env
   PORT=3000
   MONGODB_URI=mongodb://localhost/compass_app
   ```

4. Start the API
   ```shell
   npm start
   ```

## Usage

### Endpoints

#### Get User Information

Retrieves a user given an distinct email.

- **HTTP Method:** GET
- **URL:** `/api/users/{email}`

```json
{
  "user_id": 3,
  "name": "Michael Johnson",
  "email": "michael.johnson@example.com"
}
```

#### Get an User's Role

Retrieves a user's role given an distinct user_id.

- **HTTP Method:** GET
- **URL:** `/api/user_roles/{user_id}`

```json
{
  "user_id": 1,
  "role_id": 1,
  "role_name": "Student"
}
```

#### Get a Student's Information

Retrieves a student information role given an distinct user_id.

- **HTTP Method:** GET
- **URL:** `/api/students/{user_id}`

```json
{
  "user_id": 1,
  "study_hours_completed": 13,
  "study_hours_required": 20,
  "base_study_hours": 20
}
```

#### Get Skill Categories

Retrieves titles of all skill categories.

- **HTTP Method:** GET
- **URL:** `/api/skills`

```json
[
  { "skill_type_id": 1, "skill_type": "Homework" },
  { "skill_type_id": 2, "skill_type": "Reading" },
  { "skill_type_id": 3, "skill_type": "Writing" },
  { "skill_type_id": 4, "skill_type": "Notetaking" },
  { "skill_type_id": 5, "skill_type": "Growth Mindset" }
]
```

#### Get Mastery Data for a User

Retrieves all skill mastery activity for a specified user.

- **HTTP Method:** GET
- **URL:** `/api/skill_mastery/{user_id}`

Response:

```json
{
  [
    {
      "user_id": 7,
      "skill_id": 1,
      "mastery_status": 0,
      "date_of_event": "2023-05-12"
    },
    {
      "user_id": 7,
      "skill_id": 2,
      "mastery_status": 0,
      "date_of_event": "2023-04-18"
    }
  ]
}
```

#### Get Behavior Categories

Retrieves all student behaviors.

- **HTTP Method** GET
- **URL** `/api/behaviors`

Response:

```json
{
  [
    {"behavior_id":1,"behavior_name":"Missed Class"},
    {"behavior_id":2,"behavior_name":"Missed Coaching Meeting"},
    {"behavior_id":3,"behavior_name":"Incomplete Assignment"}
  ]
}
```

#### Get Consequences for a Behavior

Retrieves the penalties for a specific behavior.

- **HTTP Method** GET
- **URL** `/api/behavior_consequences/{behavior_id}`

Response:

```json
{
  "behavior_id": 2,
  "additional_study_hours": 3
}
```

#### Get User's Behaviors

Retrieves all behaviors from a given user.

- **HTTP Method** GET
- **URL** `/api/behavior_events/{user_id}`

Response:

```json
{
  [
    {"user_id":1,"behavior_id":1,"date_of_event":"2023-03-13"},
    {"user_id":1,"behavior_id":3,"date_of_event":"2023-04-02"},
    {"user_id":1,"behavior_id":2,"date_of_event":"2023-04-16"}
  ]
}
```

### Authentication

We are working on Authentication through Google's OpenID program. When we get there, we will update this section.

## Error Handling

When an error occurs, the API responds with an appropriate HTTP status code and a JSON error object. For example:

```json
{
  "error": "Invalid API key"
}
```

## Examples

## Contributing

At this current time, no one is allowed to contribute to this project. If you would like to help, reach out to
craveiroa@merrimack.edu.

## License

We do not have a license as of right now, when we do, we will update it here.
