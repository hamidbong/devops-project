# build React app
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json ./
RUN npm ci
COPY . .
RUN npm run build

# serve with nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
# replace default nginx conf to listen on 80 (default)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
