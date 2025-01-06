import { default as eventListArr } from "./eventList.json"

const eventList = new Set(eventListArr)

class Events {
  callbacks = [];
  nextId = 0;

  // emit event
  emit(eventName, value) {
    if (!eventList.has(eventName)) {
      console.error("Unsupported event name", eventName)
    }
    this.callbacks.forEach(stored => {
      if (stored.eventName === eventName) {
        stored.callback(value)
      }
    })
  }

  // subscribe to something happening
  on(eventName, caller, callback) {
    if (!eventList.has(eventName)) {
      console.error("Unsupported event name", eventName)
    }
    this.nextId += 1;
    this.callbacks.push({
      id: this.nextId,
      eventName,
      caller,
      callback,
    });
    return this.nextId;
  }

  // remove the subscription
  off(id) {
    this.callbacks = this.callbacks.filter((stored) => stored.id !== id);
  }

  unsubscribe(caller) {
    this.callbacks = this.callbacks.filter(
      (stored) => stored.caller !== caller,
    );
  }


}

export const events = new Events();