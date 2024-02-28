import { ValidationError as CoreValidationError } from 'class-validator';

export class BaseException extends Error {
  constructor(
    public readonly key: string,
    public readonly message: string,
    public readonly payload?: any,
  ) {
    super(message);
  }
}

export class ValidationError extends BaseException {
  constructor(
    public readonly message: string,
    errors?: CoreValidationError[],
  ) {
    super('VALIDATION_ERROR', message, errors);
  }
}
