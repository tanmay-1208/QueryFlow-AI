# Use Maven to build the application
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Use OpenJDK to run the application
FROM openjdk:17.0.1-jdk-slim
COPY --from=build /target/*.jar app.jar
EXPOSE 7860
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=7860"]
