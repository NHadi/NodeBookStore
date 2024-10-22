# Use a Node.js 18 base image, which supports ReadableStream
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy the package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Expose the application's port
EXPOSE 8082

# Start the application
CMD ["npm", "start"]
