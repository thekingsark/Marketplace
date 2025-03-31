import EventEmitter from 'eventemitter3'

class EventEmitterService {
  eventEmitter = new EventEmitter()

  on(event: string, listener: (...args: unknown[]) => void) {
    this.eventEmitter.on(event, listener)
  }

  once(event: string, listener: (...args: unknown[]) => void) {
    this.eventEmitter.once(event, listener)
  }

  off(event: string, listener: (...args: unknown[]) => void) {
    this.eventEmitter.off(event, listener)
  }

  emit(event: string, ...args: unknown[]) {
    this.eventEmitter.emit(event, ...args)
  }
}

const eventEmitterService = new EventEmitterService()
export { eventEmitterService as EventEmitterService }
