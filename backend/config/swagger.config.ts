import swaggerJsdoc, { SwaggerDefinition, Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import logger from "./logger.config.js";
import path from 'path';
import YAML from 'yamljs';
import { fileURLToPath } from "url";
import { open } from "fs";


function loadYamlFile(filePath: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return YAML.load(path.join(__dirname, filePath));
}

// Load base OpenAPI YAML file
const openapiMainDefinition = loadYamlFile("../docs/swagger-docs/openapi.yaml");

// Load Database models
const answerModel = loadYamlFile("../docs/swagger-docs/models/answer.model.yaml");

// Load errors
const databaseError = loadYamlFile("../docs/swagger-docs/errors/database.error.yaml");
const serviceError = loadYamlFile("../docs/swagger-docs/errors/service.error.yaml");
const validationError = loadYamlFile("../docs/swagger-docs/errors/validation.error.yaml");
const responseCode = loadYamlFile("../docs/swagger-docs/errors/response.code.yaml");
const clientError = loadYamlFile("../docs/swagger-docs/errors/client.error.yaml");

// Load routes
const authRoute = loadYamlFile("../docs/swagger-docs/routes/auth.route.yaml");
const userRoute = loadYamlFile("../docs/swagger-docs/routes/user.route.yaml");
const sessionRoute = loadYamlFile("../docs/swagger-docs/routes/session.auth.route.yaml");
const passwordRoute = loadYamlFile("../docs/swagger-docs/routes/password.auth.route.yaml");
const twoFactorRoute = loadYamlFile("../docs/swagger-docs/routes/2fa.auth.route.yaml");
const securityRoute = loadYamlFile("../docs/swagger-docs/routes/security.auth.route.yaml");

const options: Options = {
  swaggerDefinition: openapiMainDefinition,
  apis: [],
};

if (!openapiMainDefinition.components.schemas) {
  openapiMainDefinition.components.schemas = {};
}

openapiMainDefinition.components.schemas = {
  ...openapiMainDefinition.components.schemas,
  ...answerModel.definitions,
  ...databaseError.definitions,
  ...serviceError.definitions,
  ...validationError.definitions,
  ...responseCode.definitions,
  ...clientError.definitions,
};

openapiMainDefinition.paths = {
  ...openapiMainDefinition.paths,
  ...authRoute.paths,
  ...userRoute.paths,
  ...sessionRoute.paths,
  ...passwordRoute.paths,
  ...twoFactorRoute.paths,
  ...securityRoute.paths,
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application, port: number) {
  if (!app || typeof app.use !== "function") {
    throw new Error("Valid Express app instance is required");
  }

  // Swagger page
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Docs available at http://localhost:${port}/api-docs`);
}

export default swaggerDocs;
