# Étape 1 : Build avec Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY . .

# Compiler et packager le projet
RUN mvn clean package -DskipTests

# Étape 2 : Exécuter avec un JDK plus léger
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copier le jar compilé depuis l’étape précédente
COPY --from=build /app/target/*.jar app.jar

# Exposer le port si nécessaire (par exemple 8080)
EXPOSE 8080

# Commande d’exécution
CMD ["java", "-jar", "app.jar"]
