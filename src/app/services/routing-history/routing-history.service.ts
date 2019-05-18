import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutingHistoryService {

  private history: string;

  constructor() { }

  getPreviousUrl(): string | null {
    if (this.history) {
       const url = this.history;
       this.history = null;
       console.log('url to return: ', url);
       return url;
    }
    return null;
  }
}
