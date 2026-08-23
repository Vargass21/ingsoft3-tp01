export class AppError extends Error {
  constructor(status, error, message) { super(message); this.status = status; this.error = error; }
}
