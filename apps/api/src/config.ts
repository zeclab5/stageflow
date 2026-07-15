export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  dbPath: process.env.STAGEFLOW_DB_PATH ?? '/tmp/stageflow-api.sqlite',
};
