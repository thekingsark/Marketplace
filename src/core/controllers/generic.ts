import { GenericRepository } from '../repositories/generic'

class GenericController {
  public async sendMessage(message: string) {
    return GenericRepository.sendMessage(message)
  }
}

const genericControllerInstance = new GenericController()
export { genericControllerInstance as GenericController }
