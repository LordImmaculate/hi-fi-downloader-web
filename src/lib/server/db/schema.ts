import { pgTable, serial, integer, text } from "drizzle-orm/pg-core";

export const task = pgTable("task", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  priority: integer("priority").notNull().default(1)
});

export const downloadError = pgTable("download_error", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  timestamp: integer("timestamp").notNull()
});

export * from "./auth.schema";
