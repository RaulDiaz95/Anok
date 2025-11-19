# Multi-stage build for Spring Boot application

# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Set JVM options for containerized environments
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Run the application with Spring Profile from environment variable
# SPRING_PROFILES_ACTIVE will be set via Render environment variables
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-dev} -jar app.jar"]
