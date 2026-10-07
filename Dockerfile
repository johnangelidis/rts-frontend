# ==========================================
# Stage 1: Build the Angular application
# ==========================================
FROM node:24.15.0-alpine AS build
# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install project dependencies cleanly
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Angular application
RUN npm run build

# ==========================================
# Stage 2: Serve the application with NGINX
# ==========================================
FROM nginx:alpine

# Copy custom NGINX configuration to handle client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled production build output over to NGINX HTML folder
COPY --from=build /app/dist/rts-frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
