FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV EXPO_TELEMETRY_DISABLED=1
ENV CI=1
EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
CMD ["npx","expo","start","--tunnel","--non-interactive","--clear","--port","8081"]
