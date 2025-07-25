import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingModel } from '../model/booking.model';
import { PageResponse } from '../model/page-response.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private url = '/bookings';

  constructor(private http: HttpClient) {}

  getAllBookings(page: number, size: number, sort: string, direction: string): Observable<PageResponse<BookingModel>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sort},${direction}`);
    return this.http.get<PageResponse<BookingModel>>(this.url, { params });
  }

  create(booking: BookingModel): Observable<BookingModel> {
    return this.http.post<BookingModel>(this.url, booking);
  }

  update(booking: BookingModel): Observable<BookingModel> {
    return this.http.put<BookingModel>(this.url, booking);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
