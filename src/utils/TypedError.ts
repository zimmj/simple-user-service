type ErrorType =
  | 'internal_server_error'
  | 'not_found'
  | 'user_already_exists'
  | 'invalid_credentials'
  | 'unauthorized';

class TypedError extends Error {
  type: ErrorType;

  constructor(message: string, type: ErrorType) {
    super(message);
    this.name = 'TypesError';
    this.type = type;
  }
}

export { TypedError, ErrorType };
