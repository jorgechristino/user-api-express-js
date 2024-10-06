# User Management API

This is a user management API built with Node.js and Express. The API allows you to create, view, edit, remove, and manage users, as well as perform authentication and password recovery. The API also uses JWT authentication to protect specific routes.

## Endpoints

### Home

#### GET /

- **Description:** Returns a welcome message.
- **Authentication:** Not required.

### Users

#### POST /user

- **Description:** Creates a new user.
- **Request body**:

```json
{
  "email": "example@example.com",
  "name": "User Name",
  "password": "password123"
}
```

- **Responses**:
  - `201`: User created successfully.
  - `400`: Invalid data.
  - `406`: Email is already registered.
- **Authentication**: Not required.

#### GET /user

- **Description:** Returns the list of all users.
- **Responses**:
  - `200`: User list returned successfully.
  - `401`: Unauthorized.
- **Authentication**: Admin authentication via JWT required.

#### GET /user/:id

- **Description:** Returns information of a specific user.
- **Responses**:
  - `200`: User found.
  - `404`: User not found.
  - `401`: Unauthorized.
- **Authentication**: Admin authentication via JWT required.

#### PUT /user

- **Description:** Edits a user's information.
- **Request body**:

```json
{
  "id": 1,
  "name": "New Name",
  "email": "newemail@example.com",
  "role": "newRole"
}
```

- **Responses**:
  - `200`: User updated successfully.
  - `406`: Invalid data or server error.
  - `401`: Unauthorized.
- **Authentication**: Admin authentication via JWT required.

#### DELETE /user/:id

- **Description:** Removes a user.
- **Responses**:
  - `200`: User removed successfully.
  - `404`: User not found.
  - `401`: Unauthorized.
- **Authentication**: Admin authentication via JWT required.

### Authentication

#### POST /login

- **Description:** Logs in the user.
- **Request body**:

```json
{
  "email": "example@example.com",
  "password": "password123"
}
```

- **Responses**:
  - `200`: Login successful, returns JWT token.
  - `406`: Incorrect credentials.
- **Authentication**: Not required.

#### POST /validate

- **Description:** Validates if the JWT token is valid.
- **Responses**:
  - `200`: Token is valid.
  - `401`: Unauthorized.
- **Authentication**: Admin authentication via JWT required.

### Password Recovery

#### POST /recoverpassword

- **Description:** Generates a token for password recovery.
- **Request body**:

```json
{
  "email": "example@example.com"
}
```

- **Responses**:
  - `200`: Token generated successfully.
  - `406`: Email not found.
- **Authentication**: Not required.

#### POST /changepassword

- **Description:** Changes the user's password using a password recovery token.
- **Request body**:

```json
{
  "token": "recoveryToken",
  "password": "newPassword123"
}
```

- **Responses**:
  - `200`: Password changed successfully.
  - `406`: Invalid or expired token.
- **Authentication**: Not required.

## Authentication

This API uses JWT (JSON Web Token) to protect specific routes. To access protected routes, include the JWT token in the request header as follows:

```
Authorization: Bearer <your-token>
```

## Installation

1. Clone the repository:

```
git clone https://github.com/jorgechristino/user-api-express-js.git
```

2. Install dependencies:

```
npm install
```

3. Configure the JWT secret key in the UserController.js file:

```
scret = <your-secret-key>
```

4. Start the server:

```
node index.js
```

## Technologies used

- **Node.js**
- **Express**
- **JWT** (Json Web Token)
- **Bcrypt** (for password hashing)
- **MySQL**
