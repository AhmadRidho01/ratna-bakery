import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { sendError } from "../utils/response";

export const validate = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMessages = result.error.issues
        .map((issue) => `${String(issue.path.join("."))}: ${issue.message}`)
        .join(", ");

      sendError(res, errorMessages, 400);
      return;
    }

    req.body = result.data;
    next();
  };
};
