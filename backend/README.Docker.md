# Docker Guide

This document provides instructions for building and running the application using Docker. It covers both development and production environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Docker Setup](#docker-setup)
3. [Development Environment](#development-environment)
   - Build the Docker Image
   - Run the Development Container
4. [Production Environment](#production-environment)
   - Build the Production Image
   - Run the Production Container
5. [Managing Containers](#managing-containers)
6. [Common Docker Commands](#common-docker-commands)
7. [Docker Compose](#docker-compose)
8. [Troubleshooting](#troubleshooting)

## Why the App is Containerized

**1. Consistency Across Environments**: Containerizing the app ensures that it runs consistently across different environments (development, testing, staging, and production). By packaging the application and its dependencies into a single Docker image, you eliminate the "it works on my machine" problem, as the container behaves the same regardless of where it is deployed.

**2. Simplified Dependency Management**: Docker containers bundle the application with all its dependencies, libraries, and runtime, making it easier to manage and deploy. This encapsulation prevents issues related to missing dependencies or version mismatches, ensuring that the correct versions of libraries and tools are always used.

**3. Scalability**: Containerization makes scaling the application straightforward. Containers can be easily replicated and distributed across multiple servers or orchestrated using tools like Kubernetes. This allows the app to handle increased load efficiently by simply running more instances of the containers.

**4. Isolation and Security**: Docker containers provide process isolation, which enhances security by keeping the application isolated from the host system and other containers. This reduces the risk of conflicts between applications and minimizes the attack surface.

**5. Streamlined CI/CD Pipeline**: By using Docker, the app can be integrated into a CI/CD pipeline more easily. Containers can be built, tested, and deployed automatically, ensuring that every code change is validated in an environment identical to production.

## Prerequisites

Before you begin, ensure that you have the following software installed:

- [Docker](https://docs.docker.com/get-docker/) (version `XX.X` or later)
- [Docker Compose](https://docs.docker.com/compose/install/) (if using multi-container setup)

Check that Docker is installed by running:

```bash
docker --version
docker compose version  # if applicable
```

---

## Docker Setup

The Docker configuration for this project includes:

- A **development Dockerfile** located at `docker/Dockerfile.dev` that is optimized for local development.
- A **production Dockerfile** located at `docker/Dockerfile.prod` that is optimized for production builds.

Each environment uses a slightly different configuration, as outlined in the following sections.

---

## Development Environment

### Build the Docker Image

To build the Docker image for the development environment, run the following command from the root of the project:

```bash
docker build -f docker/Dockerfile.dev -t your-app-dev .
```

### Run the Development Container

Once the image is built, you can run the development container with the following command:

```bash
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules --rm your-app-dev
```

- **Port Mapping**: This maps port `3000` in the container to port `3000` on your host machine.
- **Volume Mounting**: The local directory is mounted to `/app` in the container to allow live reloading.
- **Remove Option**: The `--rm` flag ensures the container is removed after it stops.

To run the container in the background (detached mode), add the `-d` flag:

```bash
docker run -d -p 3000:3000 -v $(pwd):/app -v /app/node_modules --rm your-app-dev
```

---

## Production Environment

### Build the Production Image

To build the Docker image for production, run the following command:

```bash
docker build -f docker/Dockerfile.prod -t your-app-prod .
```

This command builds the production-ready image using the `docker/Dockerfile.prod` configuration.

### Run the Production Container

After building the production image, run it using:

```bash
docker run -p 6002:6002 --rm your-app-prod
```

This command:
- Exposes port `6002` to match the production app.
- Uses the `--rm` flag to remove the container after it stops.

For detached mode:

```bash
docker run -d -p 6002:6002 --rm your-app-prod
```

---

## Managing Containers

To stop a running container:

```bash
docker stop <container-id>
```

To remove a stopped container:

```bash
docker rm <container-id>
```

To list all running containers:

```bash
docker ps
```

---

## Common Docker Commands

Here are some additional commands you may find useful:

- **List Docker Images**:
    ```bash
    docker images
    ```

- **Remove a Docker Image**:
    ```bash
    docker rmi <image-id>
    ```

- **View Logs of a Running Container**:
    ```bash
    docker logs <container-id>
    ```

- **View the Running Processes in a Container**:
    ```bash
    docker exec -it <container-id> ps
    ```

---

## Docker Compose

If you have multiple services (like a database or additional backend services), you can use **Docker Compose** to manage them more easily.

### Using Docker Compose for Development

To start your development environment with Docker Compose:

1. Ensure you have a `compose.yaml` file configured for development.
2. Run the following command:

   ```bash
   docker compose up --build
   ```

   This command:
   - Builds the images.
   - Starts the containers.
   - Automatically handles networking between services.

To stop and remove the containers:

```bash
docker compose down
```

### Using Docker Compose for Production

If you have a `compose.prod.yaml` for production, you can start the services with:

```bash
docker compose -f compose.prod.yaml up --build -d
```

## Troubleshooting

### Common Issues and Fixes

- **Port Already in Use**: If you see an error about the port being in use, make sure no other containers or applications are running on the same port by running:
    ```bash
    docker ps
    ```

- **Cannot Connect to Docker Daemon**: If you encounter issues connecting to Docker, try restarting the Docker service or ensuring you have the correct permissions.

    ```bash
    sudo service docker restart
    ```

- **Volume Permission Issues**: Sometimes, volume permissions can cause issues. Ensure that the user inside the container has the appropriate permissions to access the mounted volumes.

---

## Conclusion

This guide provides all the necessary steps for building, running, and managing your Docker containers in both development and production environments. If you encounter any issues, refer to the [Troubleshooting](#troubleshooting) section or consult Docker's official [documentation](https://docs.docker.com/).