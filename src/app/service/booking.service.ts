import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingModel } from '../model/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = '/bookings';

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(this.apiUrl);
  }

  createBooking(booking: any): Observable<BookingModel> {
    return this.http.post<BookingModel>(this.apiUrl, booking);
  }

  updateBooking(booking: any): Observable<BookingModel> {
    return this.http.put<BookingModel>(this.apiUrl, booking);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
} 