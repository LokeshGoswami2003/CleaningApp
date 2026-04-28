import type { Response } from "express";

type Meta = Record<string, unknown>;

export function sendSuccess<TData>(response: Response, data: TData, meta: Meta = {}) {
  return response.json({ data, meta });
}

