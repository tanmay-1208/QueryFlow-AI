# QueryFlow AI 🤖

**QueryFlow AI** is a full-stack intelligent assistant application powered by OpenAI and Spring AI. It provides a conversational interface where users can ask questions and receive AI-generated responses, with all interactions persisted in a PostgreSQL database.

🔗 **Live Demo:** https://query-flow-ai-uq5t-pkcmakvyz-tanmay-1208s-projects.vercel.app

---

## Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.3**
- **Spring AI** (OpenAI integration via `spring-ai-openai-spring-boot-starter`)
- **Spring Data JPA** for database access
- **PostgreSQL** as the relational database
- **Lombok** for reducing boilerplate
- **Maven** for build and dependency management
- **Docker** for containerization

### Frontend
- **React / JavaScript**
- **CSS** for styling
- Deployed on **Vercel**

---

## Project Structure

```
QueryFlow-AI/
├── src/                        # Spring Boot backend source
│   └── main/
│       └── java/...            # Controllers, Services, Repositories, Models
├── queryflow-frontend/         # React frontend application
├── Dockerfile                  # Docker configuration for backend
├── pom.xml                     # Maven dependencies
└── mvnw / mvnw.cmd             # Maven wrapper scripts
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+ and npm
- PostgreSQL (running locally or via Docker)
- An OpenAI API Key

---

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tanmay-1208/QueryFlow-AI.git
   cd QueryFlow-AI
   ```

2. **Configure environment variables**

   Create or edit `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/queryflow
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password
   spring.jpa.hibernate.ddl-auto=update

   spring.ai.openai.api-key=your_openai_api_key
   ```

3. **Run the backend**
   ```bash
   ./mvnw spring-boot:run
   ```

   The backend will start on `http://localhost:8080`.

---

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd queryflow-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the backend URL**

   Create a `.env` file in `queryflow-frontend/`:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```

4. **Start the frontend**
   ```bash
   npm start
   ```

   The app will open on `http://localhost:3000`.

---

### Running with Docker

You can run the backend using Docker:

```bash
# Build the image
docker build -t queryflow-ai .

# Run the container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/queryflow \
  -e SPRING_DATASOURCE_USERNAME=your_username \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  -e SPRING_AI_OPENAI_API_KEY=your_openai_api_key \
  queryflow-ai
```

---

## Deployment

| Layer     | Platform  |
|-----------|-----------|
| Frontend  | [Vercel](https://vercel.com) |
| Backend   | Docker-compatible (any cloud: Railway, Render, AWS, GCP, etc.) |
| Database  | PostgreSQL (managed or self-hosted) |

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Database password |
| `SPRING_AI_OPENAI_API_KEY` | Your OpenAI API key |
| `REACT_APP_API_URL` | Backend base URL (frontend) |

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with ☕ Java, ⚛️ React