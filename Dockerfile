# Base image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install PNPM
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using PNPM
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm run build --cache-control "no-store, no-cache, must-revalidate, proxy-revalidate"

# Expose the default port for Next.js
EXPOSE 3000

# Start the Next.js server
CMD ["pnpm", "run", "start"]
