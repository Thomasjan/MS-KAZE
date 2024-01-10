# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the application files to the container
COPY . .

# Copy the custom entrypoint script
COPY entrypoint.sh .

# Expose the port that your app is running on
EXPOSE 3000

# Run the custom entrypoint script
CMD ["./entrypoint.sh"]
