FROM ubuntu:latest

# Install dependencies
RUN apt-get update && \
    apt-get install -y curl ca-certificates build-essential bash git && \
    apt-get clean

# Install nvm
ENV NVM_DIR=/root/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install Node.js using nvm (in the same shell session)
RUN bash -c "source $NVM_DIR/nvm.sh && \
             nvm install 24 && \
             nvm alias default 24 && \
             nvm use 24 && \
             npm install -g npm"  # optional: update npm

# Add node and npm to PATH explicitly
ENV NODE_VERSION=24
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

WORKDIR /app

# Copy package files first to take advantage of Docker caching
COPY package*.json ./

# Install dependencies using nvm-managed node
RUN bash -c "source $NVM_DIR/nvm.sh && npm install"

# Copy rest of the app
COPY . .

# Build if needed
# RUN bash -c "source $NVM_DIR/nvm.sh && npm run build"

EXPOSE 3000

CMD ["bash", "-c", "source $NVM_DIR/nvm.sh && npm start"]