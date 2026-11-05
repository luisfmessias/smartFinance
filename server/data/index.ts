import "server-only";
import { prismaStore } from "./prisma-store";
import type { DataStore } from "./types";

export const getStore = (): DataStore => prismaStore;
