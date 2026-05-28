# GitHub Profile Analyzer API

Backend service that analyzes public GitHub profiles using the GitHub public API and stores useful insights in a MySQL database.

## Tech Stack

- Node.js
- Express.js
- MySQL
- GitHub REST API

## Features

- Analyze a GitHub user by username.
- Store profile insights in MySQL.
- Update existing analyzed profiles when analyzed again.
- Fetch all stored analyzed profiles.
- Fetch one stored profile by username.
- Stores useful insights such as public repositories, followers, following, total stars, total forks, top language, language summary, and most starred repository.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | API information |
| GET | `/health` | Health check |
| POST | `/api/profiles/analyze/:username` | Fetch from GitHub, analyze, and store profile |
| GET | `/api/profiles` | Get all stored analyzed profiles |
| GET | `/api/profiles/:username` | Get one stored analyzed profile |

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create a MySQL database by importing `schema.sql`:

```bash
mysql -u root -p < schema.sql
```

3. Create `.env` from the sample file:

```bash
cp .env.example .env
```

4. Update `.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=github_profile_analyzer
GITHUB_TOKEN=
GITHUB_REPO_PAGE_LIMIT=10
```

`GITHUB_TOKEN` is optional, but recommended because unauthenticated GitHub API calls have lower rate limits.

5. Start the API:

```bash
npm run dev
```

For production:

```bash
npm start
```

## Example Requests

Analyze and store a profile:

```bash
curl -X POST http://localhost:5000/api/profiles/analyze/octocat
```

Fetch all stored profiles:

```bash
curl http://localhost:5000/api/profiles
```

Fetch one stored profile:

```bash
curl http://localhost:5000/api/profiles/octocat
```

## Database Schema

The database export is available in `schema.sql`.

Main table: `github_profiles`

Stored fields include:

- Basic GitHub profile details
- Repository count
- Gist count
- Followers and following counts
- Total stars across fetched repositories
- Total forks across fetched repositories
- Total open issues across fetched repositories
- Top programming language
- Language usage summary as JSON
- Most starred repository as JSON
- Account creation and last analysis timestamps

## Submission Checklist

- GitHub repository link: https://github.com/Jaswanth-Reddy-2006/GitHub-Profile-Analyzer-API.git
- Live deployed API URL: Add your deployment URL here.
- README file with setup instructions: Included.
- Database schema/export: Included as `schema.sql`.
- Postman collection: Included as `postman_collection.json`.
