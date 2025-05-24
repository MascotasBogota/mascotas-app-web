class Handler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  // Método principal que debe ser implementado por las subclases
  async handle(context, res) {
    if (this.nextHandler) {
      return await this.nextHandler.handle(context, res);
    }
    return { success: true, message: "All validations passed." };
  }
}

export default Handler;
