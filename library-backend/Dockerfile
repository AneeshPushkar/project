## Multi-stage Dockerfile for Spring Boot + Maven Wrapper

# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven wrapper and pom first to leverage Docker layer cache
COPY pom.xml ./
COPY mvnw mvnw.cmd ./
COPY .mvn .mvn

# Make sure mvnw is executable (for Linux in Docker)
RUN chmod +x mvnw

# Download dependencies (optional but speeds up subsequent builds)
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the backend source code
COPY src ./src

# Build the Spring Boot jar, skipping tests
RUN ./mvnw clean package -DskipTests


# ---------- Runtime stage ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/library-management-backend-0.0.1-SNAPSHOT.jar app.jar

# Render sets the PORT env var; your app already reads server.port=${PORT:8080}
ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]

