import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

const isProduction = env.NODE_ENV === "production";
const routeGlob = isProduction
  ? "dist/modules/**/presentation/*.routes.js"
  : "src/modules/**/presentation/*.routes.ts";

const publicUrl =
  env.API_PUBLIC_URL ?? `http://localhost:${env.PORT}`;

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GymPro Backend API",
      version: "1.0.0",
      description:
        "Backend API for single-gym member management, income/expense tracking, and content delivery.\n\n" +
        "## Response envelope\n" +
        "All endpoints return `{ success, message?, data?, errors? }`.\n\n" +
        "## Authentication\n" +
        "- **Dashboard (owner):** `POST /api/auth/owner/login` → use `Authorization: Bearer <token>` on protected routes.\n" +
        "- **Mobile (member):** `POST /api/auth/member/login` by phone.\n\n" +
        "## Public routes (no token)\n" +
        "- `POST /api/members` — member registration\n" +
        "- `GET /api/plans`, `GET /api/plans/{id}` — plan listing\n" +
        "- `GET /api/services`, `GET /api/services/{id}` — service listing\n" +
        "- `GET /api/content`, `GET /api/content/daily-quote`, `GET /api/content/{id}` — content\n" +
        "- `POST /api/auth/owner/login`, `POST /api/auth/member/login`",
    },
    servers: [{ url: publicUrl, description: isProduction ? "Production" : "Local dev" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Step 1: Call POST /api/auth/owner/login. Step 2: Copy only the token value from data.token. Step 3: Click Authorize and paste the token (do NOT type 'Bearer').",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          required: ["success", "data"],
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", nullable: true },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          required: ["success", "message"],
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "object",
              nullable: true,
              description: "Zod validation errors or extra context",
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Validation failed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Unauthorized: {
          description: "Missing or invalid JWT",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Forbidden: {
          description: "Insufficient permissions",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        Conflict: {
          description: "Duplicate or conflicting record",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [routeGlob],
});

const PUBLIC_OPERATIONS = new Set([
  "post /api/members",
  "get /api/plans",
  "get /api/plans/{id}",
  "get /api/services",
  "get /api/services/{id}",
  "get /api/content",
  "get /api/content/daily-quote",
  "get /api/content/{id}",
  "post /api/auth/owner/login",
  "post /api/auth/member/login",
]);

type OpenApiOperation = {
  security?: Array<Record<string, string[]>>;
  responses?: Record<string, unknown>;
};

type OpenApiSpec = {
  paths?: Record<string, Record<string, OpenApiOperation>>;
};

function applyRouteSecurity(spec: OpenApiSpec) {
  if (!spec.paths) {
    return;
  }

  for (const [path, methods] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      const key = `${method.toLowerCase()} ${path}`;
      if (PUBLIC_OPERATIONS.has(key)) {
        operation.security = [];
        continue;
      }

      operation.security = [{ bearerAuth: [] }];
      operation.responses = {
        ...operation.responses,
        401: { $ref: "#/components/responses/Unauthorized" },
      };
    }
  }
}

applyRouteSecurity(swaggerSpec as OpenApiSpec);
