# Étape 1 : Build Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier le pom.xml et télécharger les dépendances en cache
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le reste du projet
COPY src ./src

# Construire le jar sans les tests
RUN mvn clean package -DskipTests

# Étape 2 : Image d'exécution légère
FROM eclipse-temurin:17-jdk-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier le jar depuis le build
COPY --from=builder /app/target/*.jar app.jar

# Port exposé par l'application
EXPOSE 8080

# Lancer l'application
ENTRYPOINT ["java","-jar","app.jar"]
