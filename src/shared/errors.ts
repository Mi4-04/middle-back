import { ValidationError as CoreValidationError } from 'class-validator'

export class BaseException extends Error {
  constructor(
    public readonly key: string,
    public readonly message: string,
    public readonly payload?: any
  ) {
    super(message)
  }
}

export class ValidationError extends BaseException {
  constructor(
    public readonly message: string,
    errors?: CoreValidationError[]
  ) {
    super('VALIDATION_ERROR', message, errors)
  }
}

export class AuthTokenError extends BaseException {
  constructor(public readonly message: string) {
    super('AUTH_TOKEN_ERROR', message)
  }
}

export class UserAlreadyExistError extends BaseException {
  constructor(public readonly message: string) {
    super('USER_ALREADY_EXIST_ERROR', message)
  }
}

export class UserNotFoundError extends BaseException {
  constructor(public readonly message: string) {
    super('USER_NOT_FOUND_ERROR', message)
  }
}

export class IncorrectPasswordError extends BaseException {
  constructor(public readonly message: string) {
    super('INCORRECT_PASSWORD_ERROR', message)
  }
}

export class PlaylistNotFoundError extends BaseException {
  constructor(public readonly message: string) {
    super('PLAYLIST_NOT_FOUND_ERROR', message)
  }
}

export class TrackAlreadyExistInPlaylistError extends BaseException {
  constructor(public readonly message: string) {
    super('TRACK_ALREADY_EXIST_IN_PLAYLIST_ERROR', message)
  }
}
