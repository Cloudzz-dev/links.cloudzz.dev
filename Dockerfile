FROM node:18-alpine

WORKDIR /app

# Install git and openssh for git pull, and libc6-compat for some node modules
RUN apk add --no-cache git openssh libc6-compat

# Copy start script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose the port
EXPOSE 3535

# Set entrypoint
ENTRYPOINT ["start.sh"]
