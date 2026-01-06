# Smart Notes Backend API

A RESTful API built with Express.js, TypeScript, and Supabase for managing notes.

## Features

- Full CRUD operations for notes
- TypeScript for type safety
- Supabase integration for database management
- Error handling middleware
- CORS enabled
- RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zeerak-Zubair/smart-notes-backend.git
   cd smart-notes-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   The `.env` file should contain:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   PORT=5000
   ```

4. **Create the notes table in Supabase**

   Run this SQL in your Supabase SQL Editor:
   ```sql
   create table notes (
     id uuid default uuid_generate_v4() primary key,
     title text not null,
     content text not null,
     tags text[],
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable Row Level Security (optional but recommended)
   alter table notes enable row level security;

   -- Create a policy to allow all operations (adjust based on your needs)
   create policy "Allow all operations on notes"
   on notes for all
   using (true)
   with check (true);
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

Base URL: `http://localhost:5000`

### Health Check

**GET /**
```bash
curl http://localhost:5000/
```

Response:
```json
{
  "message": "Smart Notes API",
  "version": "1.0.0",
  "endpoints": {
    "notes": "/api/notes"
  }
}
```

### Notes Endpoints

#### Get All Notes

**GET /api/notes**
```bash
curl http://localhost:5000/api/notes
```

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "My First Note",
      "content": "This is the content of my first note",
      "tags": ["personal", "ideas"],
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

#### Get Note by ID

**GET /api/notes/:id**
```bash
curl http://localhost:5000/api/notes/123e4567-e89b-12d3-a456-426614174000
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "My First Note",
    "content": "This is the content of my first note",
    "tags": ["personal", "ideas"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

#### Create Note

**POST /api/notes**
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Note",
    "content": "This is a new note",
    "tags": ["work", "important"]
  }'
```

Request Body:
```json
{
  "title": "New Note",
  "content": "This is a new note",
  "tags": ["work", "important"]
}
```

Response:
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "title": "New Note",
    "content": "This is a new note",
    "tags": ["work", "important"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

#### Update Note

**PUT /api/notes/:id**
```bash
curl -X PUT http://localhost:5000/api/notes/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Note Title",
    "content": "Updated content"
  }'
```

Request Body (all fields optional):
```json
{
  "title": "Updated Note Title",
  "content": "Updated content",
  "tags": ["updated", "modified"]
}
```

Response:
```json
{
  "success": true,
  "message": "Note updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Updated Note Title",
    "content": "Updated content",
    "tags": ["updated", "modified"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T13:00:00Z"
  }
}
```

#### Delete Note

**DELETE /api/notes/:id**
```bash
curl -X DELETE http://localhost:5000/api/notes/123e4567-e89b-12d3-a456-426614174000
```

Response:
```json
{
  "success": true,
  "message": "Note deleted successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Deleted Note",
    "content": "This note was deleted",
    "tags": ["deleted"],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Project Structure

```
smart-notes-backend/
├── src/
│   ├── config/
│   │   └── supabase.ts         # Supabase client configuration
│   ├── controllers/
│   │   └── notesController.ts  # Notes business logic
│   ├── middleware/
│   │   └── errorHandler.ts     # Global error handling
│   ├── routes/
│   │   └── notes.ts            # Notes routes
│   └── index.ts                # Express app setup
├── dist/                       # Compiled JavaScript
├── .env                        # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Supabase** - Backend as a Service (Database)
- **dotenv** - Environment variable management
- **CORS** - Cross-Origin Resource Sharing

## License

ISC
