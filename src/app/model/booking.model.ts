import { CustomerModel } from "./customer.model";
import { VehicleModel } from "./vehicle.model";

export interface BookingModel {
  id?: number;
  customer: CustomerModel | null;
  vehicle: VehicleModel | null;
  dateFrom: string | null;
  dateTo: string | null;
  total: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}
