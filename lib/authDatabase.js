export function getAuthDatabaseSetupResponse(error) {
  if (!process.env.DATABASE_URL?.trim()) {
    return Response.json(
      {
        message:
          "The hospital database is not configured. Set DATABASE_URL in .env.local, then restart the development server.",
      },
      { status: 503 }
    );
  }

  if (
    error?.name === "PrismaClientInitializationError" ||
    error?.code === "P1001" ||
    error?.code === "P1003"
  ) {
    return Response.json(
      {
        message:
          "The hospital database is unavailable. Check DATABASE_URL and make sure the PostgreSQL server is running.",
      },
      { status: 503 }
    );
  }

  if (error?.code === "P2021" || error?.code === "P2022") {
    return Response.json(
      {
        message:
          "The hospital database tables are not up to date. Run npx prisma migrate dev, then try again.",
      },
      { status: 503 }
    );
  }

  return null;
}
