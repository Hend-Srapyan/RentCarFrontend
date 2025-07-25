import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../model/page-response.model';
import { CustomerModel } from '../model/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private url = '/customers';

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number, sort: string, direction: string): Observable<PageResponse<CustomerModel>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sort},${direction}`);
    return this.http.get<PageResponse<CustomerModel>>(this.url, { params });
  }

  create(customer: CustomerModel): Observable<CustomerModel> {
    return this.http.post<CustomerModel>(this.url, customer);
  }

  update(customer: CustomerModel): Observable<CustomerModel> {
    return this.http.put<CustomerModel>(this.url, customer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
