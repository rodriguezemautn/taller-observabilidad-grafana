export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} con id ${id} no encontrado`)
    this.name = "NotFoundError"
  }
}
