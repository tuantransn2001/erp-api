require("dotenv").config();
const ROOT_URL = process.env.ROOT_URL;
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const swaggerDescription = {
  openapi: "3.0.1",
  info: {
    title: "REST API for Swagger Documentation",
    version: "1.0.0",
  },
  schemes: ["http"],
  servers: [{ url: `http://${HOST}:${PORT}${ROOT_URL}` }],
  paths: {
    "/auth/login": {
      post: {
        tags: ["ExampleEndpoints"],
        summary: "Send a text to the server",
        description:
          "Send a message to the server and get a response added to the original text.",
        parameters: [
          {
            in: "body",
            name: "default",
            description: "Client'email",
            required: false,
            schema: {
              $ref: "#/definitions/Pet",
            },
          },
        ],

        responses: {
          201: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ExampleSchemaBody",
                },
              },
            },
          },
          404: { description: "Not found" },
          500: { description: "Internal server error" },
        },
      },
    },
  },
  components: {
    schemas: {
      ExampleSchemaBody: {
        properties: {
          responseText: {
            type: "string",
            example: "This is some example string! This is an endpoint",
          },
        },
      },
      ExampleSchemaHeader: {
        required: ["text"],
        properties: {
          text: {
            type: "string",
            example: "This is some example string!",
          },
        },
      },
    },
  },
};

module.exports = swaggerDescription;
