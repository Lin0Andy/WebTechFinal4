# D&D Spell Book (and some other)

Welcome to the D&D Spell Book! This application allows you to explore and search for spells available in the Dungeons & Dragons game.

## Table of Contents

1. [Introduction](#introduction)
2. [Setup](#setup)
3. [API Usage](#api-usage)
4. [Key Design Decisions](#key-design-decisions)
5. [Password Security](#password-security)

## Introduction

The D&D Spell Book is a web application designed to help Dungeons & Dragons players explore and search for spells available in the game. Users can search for spells by name, view spell details, and explore spell lists based on different criteria.

## Setup

To set up the D&D Spell Book application, follow these steps:

### Prerequisites

- Node.js installed on your system
- MongoDB Atlas account for database storage
- API access token for the D&D spell database (if required)

### Installation

1. Clone the repository from GitHub:
```git clone https://github.com/your-username/dnd-spell-book.git```

2. Navigate to the project directory:
```cd dnd-spell-book```

3. Install dependencies:
```npm install```

4. Set up environment variables by creating a `.env` file in the root directory:
<p>MONGODB_API=CJpsh8s2sz7ka4WcsXKYvlfEg8Afz0NhEhuP3bPPVeiOG0mKMRT2ieMmjSbq40iU</p>
<p>MONGODB_CON_STR=""</p>
<p>SESSION_SECRET=""</p>
<p>PORT=""</p>
<p>TRIVIA_API_URL=""</p>

5. Start the application:
```npm start```


6. Access the application in your web browser at `http://localhost:3000`.

## API Usage

The D&D Spell Book application utilizes the D&D spell database API to fetch spell information. The API allows users to search for spells by name and retrieve detailed information about each spell.
The application also utilizes Trivia API for a BoardGames related quiz games. 

### Endpoints

- `/dnd/search`: Allows users to search for spells by name.
- `/dnd/spell/:id`: Retrieves detailed information about a specific spell by its ID.
- `/admin`: Allows admins to perform CRUD operations regarding user (get users' list, add new user, update user's information, delete user)
- `/user`: Handles user authentication and authorization
- `/items`: Allows users to buy items from the markte place, and admins to handle CRUD operations with marketplace
- `/quiz`: Quiz! Great! About BoardGames! Even better! (would there be API for D&D quizes it would be even greater)

### Request Parameters

- `spellName`: The name of the spell to search for.
- `id`: The ID of the items in marketplace and users' ID in admin page 

### Response Format

The response from the API is in JSON format and includes details about each spell, such as name, description, level, school, components, and more.

## Key Design Decisions

The D&D Spell Book application was designed with the following key decisions in mind:

- **User Experience**: The application aims to provide an intuitive and user-friendly interface for players to explore spells easily.
- **Scalability**: The use of MongoDB Atlas ensures scalability and flexibility in storing spell data as the application grows.
- **Security**: The application employs session management and encryption techniques to ensure user data security and prevent unauthorized access.
- **Modularity**: The codebase is organized into modules and follows best practices to enhance readability, maintainability, and extensibility.

## Password Security

Passwords used for authentication in the D&D Spell Book application are securely hashed using industry-standard hashing algorithms (e.g., bcrypt). The application also employs salting techniques to further enhance password security. User passwords are never stored in plain text.

Thank you for using the D&D Spell Book!
