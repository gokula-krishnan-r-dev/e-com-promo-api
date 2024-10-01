import { Response } from 'express';

// utils/responseJson.ts
export const responseJson = (res: Response, statusCode: number, message: string, data: any = null, error: any = null) => {
  const response = {
    code: statusCode,
    message,
    ...(data && { data }), // Include data only if it exists
    ...(error && { error }), // Include error only if it exists
  };

  return res.status(statusCode).json(response);
};
