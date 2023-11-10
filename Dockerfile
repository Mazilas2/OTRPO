# Start with the Python 3 image
FROM mcr.microsoft.com/devcontainers/python:1-3.11-bookworm

# Set the working directory in the container to /app
WORKDIR /app

# Add only the necessary files and folders into the container at /app
ADD . /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Run ./api/create_db.py
RUN python3 ./api/create_db.py

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm

# Install pnpm
RUN npm install -g pnpm

# Install npm dependencies
RUN pnpm install

# Make port 5332 available to the world outside this container
EXPOSE 5332

ARG REDIS_HOST
ARG REDIS_PASSWORD
ARG REDIS_PORT

ARG REDIS_URL
ARG REDIS_TOKEN

ARG SENDER_EMAIL
ARG SENDER_PASSWORD

ARG FTP_USER
ARG FTP_PASSWORD
ARG FTP_HOST

# Run your Flask application and npm run dev when the container launches
CMD ["/app/run.sh"]