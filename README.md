# File Uploader

A full-stack file uploader built with React (Vite), Express (with file handling), Prisma (TypeScript ORM), and filesystem integration. Upload files, manage folders, and delete both records and physical files seamlessly.

---

##  Features

- **React + Vite frontend** allows fast, modern UI with HMR.
- **Express backend** handles file uploads/downloads and folder operations.
- **Prisma ORM** connects to your database for managing folder/file metadata.
- **File system integration**— files are saved and deleted from disk (e.g. `uploads/`).
- Supports **Rename** and **Delete** operations on folders.
- **Error handling** with server responses and frontend state updates.
- Clean UI updates with React Context and state management.

---

##  Tech Stack

| Layer         | Technology                    |
|---------------|-------------------------------|
| Frontend      | React, Vite, Context API      |
| Backend       | Node.js, Express, Multer (if used for uploads) |
| Database ORM | Prisma (PostgreSQL / SQLite / MySQL) |
| File System   | Node `fs.rm(...)` with absolute paths |

---

##  Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL / SQLite / MySQL (match your `.env` with correct `DATABASE_URL`)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/harbhulla/File-Uploader.git
   cd File-Uploader
