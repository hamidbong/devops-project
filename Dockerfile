FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

COPY ./app ./app

WORKDIR /app/app

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY --from=build /app/app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
