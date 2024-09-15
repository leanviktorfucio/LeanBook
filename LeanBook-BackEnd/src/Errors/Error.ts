import { STATUS_CODES } from "../Requests/HTTP";

export class CustomError extends Error {
  statusCode: number;
  metadata?: {};

  constructor(message: string, statusCode: number, metadata?: {}) {
    super(message);
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
}

export interface ErrorParams {
  message: string,
  metadata?: {}
}

export class NotFoundError extends CustomError {
    constructor(errorParams: ErrorParams) {
      super(errorParams.message, STATUS_CODES.NOT_FOUND, errorParams.metadata);
    }
}

export class BadRequestError extends CustomError {
    constructor(errorParams: ErrorParams) {
      super(errorParams.message, STATUS_CODES.BAD_REQUEST, errorParams.metadata);
    }
}

export class InternalServerError extends CustomError {
    constructor(errorParams: ErrorParams) {
      super(errorParams.message, STATUS_CODES.INTERNAL_SERVER_ERROR, errorParams.metadata);
    }
}