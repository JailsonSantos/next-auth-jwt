
// Classe extendida do Error Javascript, para enviar mensagem
export class AuthTokenError extends Error {
  constructor() {
    super('Error with authentication token.')
  }
}