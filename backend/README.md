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
   git clone https://github.com/yourusername/compass-app-api.git
   ```

2. Install dependencies:

   ```shell
   cd compass-app-api
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
- **URL:** '/api/users/{email}'

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
- **URL:** '/api/user_roles/{user_id}'

```json
{
  "user_id": 1,
  "role_id": 1,
  "role_name": "Student"
}
```

#### Get Mastery Log

Retrieves all skill mastery activity for a specified user.

- **HTTP Method:** GET
- **URL:** `/api/skill_mastery/{user_id}`

Response:

```json
{
  "skill_mastery_log": [
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
