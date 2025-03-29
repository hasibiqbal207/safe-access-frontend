# Node.js Backend Template

This repository provides a boilerplate for building Node.js backend applications with Express, environment configuration, linting, and basic testing setup.

**Note:** To use the JavaScript version of the boilerplate, checkout to branch **javascript**.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Usage Instructions](#usage-instructions)
- [Running the Application with Docker](#running-the-application-with-docker)
- [Testing](#testing)
- [Linting and Formatting](#linting-and-formatting)
- [Contributing](#contributing)
- [License](#license)

## Features

- Express for creating server and handling routes.
- Environment variable management using `dotenv`.
- Code linting with ESLint.
- Code formatting with Prettier.
- Structured project directories.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (v6.x or higher)

## Usage Instructions

### 1. Clone the repository

```bash
git clone https://github.com/hasibiqbal207/nodejs-backend-template.git
cd nodejs-backend-template
```

### 2. What to do before using this boilerplate

From the ''nodejs-backend-template'' folder, run the following commands to remove all the '.git' files:

```bash
# From Linux based OS | using Terminal
find . -name ".git*" -exec rm -rf {} +

# From Windows based OS | using PowerShell
Get-ChildItem -Recurse -Force -Filter ".git*" | Remove-Item -Force -Recurse
```

Rename the Folder name from 'nodejs-backend-template' to 'project-name' **or** Copy all the files in the 'project-name' folder.

Change the following attributes in 'package.json' file:

```bash
"name": "Change to project-name",
"description": "Change to any description",
"author": "Change to your name",
```
    
The 'project-name' folder should be tracked with Git. If it's tracked then only add a .gitignore file and add the following lines to .gitignore file:
 
```bash
node_modules/
.env*
```   

If it's not tracked, run the following command to add it to Git: 

```bash
git init

# Add a .gitignore file to ignore all the files in the 'project-name' folder. Add the following lines to .gitignore file:
node_modules/
.env*

# Save the changes and then commit the changes:
git add .
git commit -m "Initial commit"
```

### 3. Environment Variables

This repository contains separate configurations for development, testing, staging, and production. It is advisable to use different environment variables for different environments. 

**Note**: If you are using Docker, jump to [Running the Application with Docker](#running-the-application-with-docker) section.

### 4. Install dependencies
```bash
npm install
```

If you are installing in Production environment, run the following command instead of the above command:
```bash
npm install --production
```

### 5. Running the Server

#### 1. Start the server in development mode

```bash
# Start the server with nodemon
npm run dev
```

#### 2. Start the server in test mode [Some work left]

```bash
npm run test
```

#### 3. Start the server in staging mode

```bash
# Build the project
npm run build

# Start the server in staging mode
npm run staging
```

#### 4. Start the server in production mode
```bash
# Build the project
npm run build

# Start the server in production mode
npm run prod
```

## Running the Application with Docker
Docker allows you to containerize your application, simplifying deployment across different environments. Below are steps to build, run, and manage your Docker containers for both development and production environments.

**Note**: 
   - Ensure that you have completed the steps [1, 2, 3] in the [Usage Instructions](#usage-instructions) section.
   - The simplest step is to use docker compose. To use docker compose, follow only **step 1**.
   - Alternatively, you can first build and then run the container. To do this, follow **step 2 & 3**.
   - Here are the steps to build, run, and manage your Docker containers for development, testing, staging, and production environments.
   - Staging-Only environment: Only runs the staging environment to mooc the pre-production environment.
   - Staging environment: Tests and then runs the staging environment.

### 1. Using Docker Compose

To containerize your application, start by using docker compose. From the root directory of your project, use the following command to build the image:

To start the development service.
```
docker compose up development --build
```

To start the production service.
```
docker compose up production --build
```

To start the test service. [Some work left]
```
docker compose up test --build
```

To start the staging-only service that only runs the staging environment.
```
docker compose up staging-only --build
```

To start the staging service that will test and then run the staging environment. [Some work left]
```
docker compose up staging --build
```

In these commands:
  - By adding the service name (e.g., development or production) after the up command, it will only start that specific service, rather than starting all services defined in the file.
  - --build: This flag forces Docker Compose to rebuild the images before starting the services, even if an image already exists in the cache.

If you want to run the containers in the background, add the -d flag to either command:

```
docker compose up -d development --build
```

To stop and remove the container, use the following command:

```
docker compose down development
```

### 2. Build Docker Images

To containerize your application, start by building Docker images based on your environment. From the root directory of your project, use the following commands to build the image:

#### Development Environment
```
docker build -f docker/Dockerfile.dev -t development .
```

#### Production Environment
```
docker build -f docker/Dockerfile.prod -t production .
```

#### Test Environment [Some work left]
```
docker build -f docker/Dockerfile.prod --target test -t test .
```

#### Staging-Only Environment
```
docker build -f docker/Dockerfile.prod --target staging -t staging-only .
```

#### Staging Environment [Some work left]
```
docker build -f docker/Dockerfile.prod -t staging .
```

In these commands:
  - -f specifies the path to the Dockerfile.
  - -t tags the image with a name (development or production).


### 3. Run Docker Containers

After building the images, you can run the containers using the docker run command.

#### Development Environment
```
docker run -p 6002:6002 development
```

#### Production Environment
```
docker run -p 6002:6002 production
```

#### Test Environment [Some work left]
```
docker run -p 6002:6002 test
```

#### Staging-Only Environment
```
docker run -p 6002:6002 staging-Only
```

#### Staging Environment [Some work left]
```
docker run -p 6002:6002 staging
```

In these commands:
  - -p 6002:6002 maps port 6002 of the container to port 6002 on your machine.
  - -To run the container in the background, add the -d flag (e.g., docker run -d -p 6002:6002 portfolio-dev).

## Testing 
There are still some work left for testing. I will add it soon.

## Linting and Formatting
This repository contains a linter **[ESLint]** and a formatter **[Prettier]**. The linter and formatter are configured to run on the project.

#### Run ESLint to check for issues
```
npm run lint
```

#### Run ESLint to automatically fix issues
```
npm run lint:fix
```

#### Run Prettier to format your code
```
npm run format
```

#### Run Prettier to check if code is formatted correctly
```
npm run format:check
```

## Contributing
Please Visit [Contributing](CONTRIBUTING.md) file for more details.

## License
The software in this project is licensed under the Apache License 2.0, a permissive open-source license. By using this software, you agree to the following terms:

**Summary of the [Apache License 2.0](LICENCE)**

1. **Freedom to Use**: You can use the software for any purpose, including commercial use, without paying royalties.
2. **Modification and Distribution**: You can modify the software and distribute it in either its original or modified form, as long as you include the original license and clearly mark any changes you made.
3. **Patent Rights**: The license grants you rights to any patents held by the contributors related to the software, but if you sue anyone over patent issues involving the software, your license and patent rights terminate.
4. **No Trademark Rights**: The license doesn’t grant permission to use the names, trademarks, or logos of the contributors.
5. **No Warranty**: The software is provided "as is," without any warranties, meaning the contributors aren't responsible for any issues or damages that arise from using it.
6. **Optional Support**: If you offer warranties, support, or assume additional liability when redistributing the software, you're responsible for those obligations, not the original contributors.

**Copyright Notice**

    Copyright 2024 Hasib Iqbal

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.