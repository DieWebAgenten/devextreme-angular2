import { EventEmitter, NgZone } from '@angular/core';

const nullEmitter = new EventEmitter<any>();
const dxToNgEventNames = {};

export class NgEventsStrategy {
  private emitters: Object;
  constructor(private ngZone: NgZone) {
    this.emitters = {};
  }
  //DevExtreme EventsStrategy interface
  hasEvent(eventName: string) {
    var emitter = this.getEmitter(eventName); 
    return emitter !== nullEmitter && emitter.observers.length;
  }
  fireEvent(eventName, eventArgs) {
    this.ngZone.run(() => {
      this.getEmitter(eventName).next(eventArgs && eventArgs[0]);
    });
  }
  on(eventName, eventHandler) {
    this.getEmitter(eventName).subscribe(eventHandler);
  }
  off(eventName, eventHandler) {
    this.getEmitter(eventName).unsubscribe(eventHandler);
  }
  dispose() {
    this.emitters = {};
  }
  // Own methods
  createEmitter<T>(ngEventName: string, dxEventName: string): EventEmitter<T> {
    let result = new EventEmitter();
    this.emitters[ngEventName] = result;
    if(dxEventName) {
      dxToNgEventNames[dxEventName] = ngEventName;
    }
    return result;
  }
  getEmitter(eventName) {
    return this.emitters[dxToNgEventNames[eventName]] || nullEmitter;
  }
  hasNgEmitter(eventName: string) {
    return this.emitters[eventName];
  }
  fireNgEvent(eventName, eventArgs) {
    this.emitters[eventName].next(eventArgs && eventArgs[0]);
  }
}
