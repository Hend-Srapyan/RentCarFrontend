import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleModel } from '../model/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private url = '/vehicles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<VehicleModel[]> {
    return this.http.get<VehicleModel[]>(this.url);
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
