import { Customer } from "../service/customer.service";
import { VehicleModel } from "./vehicle.model";

export interface BookingModel {
  id?: number;
  customer: Customer | null;
  vehicle: VehicleModel | null;
  dateFrom: string | null;
  dateTo: string | null;
  total: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
} 