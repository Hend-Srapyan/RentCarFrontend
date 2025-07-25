import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleModel } from '../model/vehicle.model';
import { PageResponse } from '../model/page-response.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private url = '/vehicles';

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number, sort: string, direction: string): Observable<PageResponse<VehicleModel>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sort},${direction}`);
    return this.http.get<PageResponse<VehicleModel>>(this.url, { params });
  }

  addVehicle(formData: FormData) {
    return this.http.post<VehicleModel>(this.url, formData, { observe: 'response' });
  }

  updateVehicle(formData: FormData) {
    return this.http.put<VehicleModel>(this.url, formData, { observe: 'response' });
  }

  deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  searchVehicles(query: string): Observable<VehicleModel[]> {
    return this.http.get<VehicleModel[]>(`${this.url}/search`, { params: { query } });
  }
}
