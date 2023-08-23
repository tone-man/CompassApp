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

4. Start the API
   ```shell
   npm start
   ```

## Usage

### Endpoints

## Get User Information

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

## Get All Users

Retrieves information about users in the system, allowing for filters based on user type.

- **HTTP Method:** POST
- **URL:** `/api/users/`

### Request

The request should be a JSON object with the following properties:

- `userType`: Specifies the user type to filter the results. Valid values for `userType` are:
  - `Student`: Students
  - `Teacher`: Teachers
  - `Admin`: Admin
- `quantity`: Specifies how many entries to be returned. Default value is 1000.

Example Request:

```json
{
  "userType": 1,
  "quantity": 10
}
```

### Response

The response will be a JSON array containing objects representing user information.

Example Response:

```json
[
  {
    "user_id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com"
  },
  {
    "user_id": 2,
    "name": "Jane Doe",
    "email": "jane.doe@example.com"
  },
  ...
]
```

### Error Responses

- `400 Bad Request`: Returned if the request is missing the `userType` property.
- `404 Not Found`: Returned if there are no users matching the specified user type.
- `500 Internal Server Error`: Returned if there is an internal server error while retrieving the users.

## Get Users

### Response Codes

- 200 OK: The request was successful, and the user information is returned.
- 404 Not Found: No users exist in the system.
- 500 Internal Server Error: An error occurred while processing the request.

## Get an User's Role

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

## Get a Student's Information

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

## Get Skill Categories

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

## Get Study Hours for a user

Gets all study sessions given a disctinct user_id

- **HTTP Method:** GET
- **URL:** `/api/study_hours/{user_id}`

Response:

```json
[
  {
    "user_id": 1,
    "date_of_event": "2023-06-05",
    "log_in_time": 13,
    "log_out_time": 15,
    "study_duration": 120
  },
  {
    "user_id": 1,
    "date_of_event": "2023-06-06",
    "log_in_time": 15,
    "log_out_time": 17,
    "study_duration": 120
  },
  {
    "user_id": 1,
    "date_of_event": "2023-06-07",
    "log_in_time": 10,
    "log_out_time": 12,
    "study_duration": 120
  }
]
```

## Insert a Study Hours Entry

Creates a new instance of Study Hours for a user.
Log in time is in minutes after midnight.

- **HTTP Method:** POST
- **URL:** `/api/study_hours`

Request:

```json
{
  "userId": 1,
  "datetimeOfLogIn": "2023-06-16 11:20:00",
  "datetimeOfLogOut": "2023-06-16 11:20:00",
  "durationOfStudy": 120
}
```

### Response Codes

- 200 OK: The request was successful, and the user information is returned.
- 400 Bad Request: There is missing or incorrect information in the request.
- 500 Internal Server Error: An error occurred while processing the request.

## Update a Study Hours Entry

#### DEPRECATED

Updates a Study Hours Row for a user given a disctinct user_id,
log_in_time, date_of_event. Log out time is in minutes after midnight.

- **HTTP Method:** PATCH
- **URL:** `/api/study_hours/:user_id`

Request:

```json
{
  "log_in_time": 540, // (hours_past_midnight * 60) + minutes
  "log_out_time": 720,
  "date_of_event": "2023-05-12"
}
```

## Get Mastery Data for a User

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

## Insert Mastery Data

Creates a new Mastery Status for a user.

- **HTTP Method:** POST
- **URL:** `/api/skill_mastery`

Request:

```json
{
  "user_id": 7,
  "skill_id": 1,
  "mastery_status": 0,
  "date_of_event": "2023-05-12"
}
```

## Get Behavior Categories

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

## Get Consequences for a Behavior

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

## Get User's Behaviors

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

## Insert User Behavior Data

Creates a new Behavior for a user.

- **HTTP Method:** POST
- **URL:** `/api/behavior_events`

Request:

```json
{
  "user_id": 7,
  "behavior_id": 1,
  "date_of_event": "2023-05-12"
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
