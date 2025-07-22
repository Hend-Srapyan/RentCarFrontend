import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BookingService } from '../../service/booking.service';
import { BookingModel } from '../../model/booking.model';
import { Customer, CustomerService } from '../../service/customer.service';
import { VehicleModel } from '../../model/vehicle.model';
import { VehicleService } from '../../service/vehicle.service';
import { SearchService } from '../../service/search.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class Booking implements OnInit, OnDestroy {
  bookings: BookingModel[] = [];
  customers: Customer[] = [];
  vehicles: VehicleModel[] = [];
  showModal = false;
  formBooking: BookingModel = this.getInitialFormBooking();
  editBooking: BookingModel | null = null;
  searchQuery: string = '';
  private searchSub?: Subscription;

  constructor(
    private bookingService: BookingService,
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.loadAllData();
    this.searchSub = this.searchService.bookingSearch$.subscribe((query) => {
      this.searchQuery = query;
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
    }

  loadAllData() {
    this.bookingService.getAllBookings().subscribe(data => this.bookings = data);
    this.customerService.getAll().subscribe(data => this.customers = data);
    this.vehicleService.getAll().subscribe(data => this.vehicles = data);
  }

  getInitialFormBooking(): BookingModel {
    return {
      customer: null,
      vehicle: null,
      dateFrom: null,
      dateTo: null,
      total: 0,
      status: 'ACTIVE'
    };
  }

  openAddModal() {
    this.formBooking = this.getInitialFormBooking();
    this.editBooking = null;
    this.showModal = true;
  }

  private toDateInputValue(date: string | Date | null | undefined): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  }

  openEditModal(booking: BookingModel) {
    const customer = this.customers.find(c => c.id === booking.customer?.id) || null;
    const vehicle = this.vehicles.find(v => v.id === booking.vehicle?.id) || null;
    this.formBooking = {
      ...booking,
      customer,
      vehicle,
      dateFrom: this.toDateInputValue(booking.dateFrom),
      dateTo: this.toDateInputValue(booking.dateTo)
    };
    this.editBooking = booking;
    this.showModal = true;
  }

  saveBooking() {
    if (this.editBooking) {
      this.bookingService.updateBooking(this.formBooking).subscribe(() => {
        this.loadAllData();
        this.closeModal();
      });
    } else {
      this.bookingService.createBooking(this.formBooking).subscribe(() => {
        this.loadAllData();
        this.closeModal();
      });
    }
  }

  deleteBooking(booking: BookingModel) {
    if (booking.id) {
      this.bookingService.deleteBooking(booking.id).subscribe(() => this.loadAllData());
    }
  }

  closeModal() {
    this.showModal = false;
    this.editBooking = null;
  }

  calculateTotalPrice() {
    if (this.formBooking.dateFrom && this.formBooking.dateTo && this.formBooking.vehicle) {
      const from = new Date(this.formBooking.dateFrom);
      const to = new Date(this.formBooking.dateTo);
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      this.formBooking.total = diffDays * this.formBooking.vehicle.dailyRate;
    }
  }

  filteredBookings() {
    if (!this.searchQuery) {
      return this.bookings;
    }
    const text = this.searchQuery.toLowerCase();
    return this.bookings.filter(b =>
      (b.customer?.name && b.customer.name.toLowerCase().includes(text)) ||
      (b.vehicle?.brand && b.vehicle.brand.toLowerCase().includes(text)) ||
      (b.vehicle?.model && b.vehicle.model.toLowerCase().includes(text)) ||
      (b.dateFrom && new Date(b.dateFrom).toLocaleDateString().toLowerCase().includes(text)) ||
      (b.dateTo && new Date(b.dateTo).toLocaleDateString().toLowerCase().includes(text)) ||
      (b.total && b.total.toString().includes(text)) ||
      (b.status && b.status.toLowerCase().includes(text))
    );
  }
}
