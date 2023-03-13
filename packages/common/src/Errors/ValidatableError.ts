export interface ValidatableError {
  validate (...any): Promise<void>|void
}
