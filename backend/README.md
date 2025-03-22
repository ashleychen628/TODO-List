# TODO-List Backend

##  Backend Initial Set Up
```
$ pwd
.../TODO-List/backend

// Install project dependencies
$ npm install
```

## Run the Backend Locally
```
$ pwd
.../TODO-List/backend

// Start the development server
$ npm run dev
```

## API Endpoints

### User
- `POST /api/register` - Register new user
- `POST /api/login` - Login user and return JWT

### Tasks
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Backend Structure
```
|-- backend
    |-- config
        |-- db.js
    |-- controllers
        |-- taskController.js
        |-- userController.js
    |-- middleware
        |-- authorization.js
    |-- routes
        |-- taskRoutes.js
        |-- userRoutes.js
    |-- schemas
        |-- Task.js
        |-- User.js
    |-- .env
    |-- server.js
    |-- package.json
    |-- package-lock.json
```