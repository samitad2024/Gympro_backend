import { AppError } from "@core/errors/app-error";

type PostgresError = Error & {
  code?: string;
  detail?: string;
  cause?: unknown;
};

function getPostgresError(error: unknown): PostgresError | null {
  let current: unknown = error;

  while (current) {
    const pgError = current as PostgresError;
    if (pgError.code) {
      return pgError;
    }
    current = pgError.cause;
  }

  return null;
}

export function mapDatabaseError(error: unknown): AppError | null {
  const pgError = getPostgresError(error);
  if (!pgError?.code) {
    return null;
  }

  switch (pgError.code) {
    case "23505":
      return new AppError("A record with this value already exists", 409);
    case "23503":
      if (pgError.detail?.includes("is still referenced")) {
        return new AppError(
          "Cannot delete record while related data still exists",
          409
        );
      }
      return new AppError("Referenced record not found", 400);
    case "23502":
      return new AppError("Required field is missing", 400);
    default:
      return null;
  }
}
