import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private customerSearchSubject = new BehaviorSubject<string>('');
  customerSearch$ = this.customerSearchSubject.asObservable();

  private vehiclesSearchSubject = new BehaviorSubject<string>('');
  vehiclesSearch$ = this.vehiclesSearchSubject.asObservable();

  private bookingSearchSubject = new BehaviorSubject<string>('');
  bookingSearch$ = this.bookingSearchSubject.asObservable();

  setCustomerSearch(text: string) {
    this.customerSearchSubject.next(text);
  }

  setVehiclesSearch(text: string) {
    this.vehiclesSearchSubject.next(text);
  }

  setBookingSearch(text: string) {
    this.bookingSearchSubject.next(text);
  }
}
