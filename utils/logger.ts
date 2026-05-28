import pino from "pino";

export const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS.standard",
      ignore: "pid,hostname",
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  level: process.env.LOG_LEVEL || "info", //env environment file needed to be assigned; otherwise DEBUG
});
