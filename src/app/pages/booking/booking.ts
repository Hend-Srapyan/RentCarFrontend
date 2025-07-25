import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BookingService } from '../../service/booking.service';
import { BookingModel } from '../../model/booking.model';
import {CustomerService } from '../../service/customer.service';
import { CustomerModel } from '../../model/customer.model';
import { VehicleModel } from '../../model/vehicle.model';
import { VehicleService } from '../../service/vehicle.service';
import { SearchService } from '../../service/search.service';
import { PageResponse } from '../../model/page-response.model';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class Booking implements OnInit, OnDestroy {
  bookings: BookingModel[] = [];
  totalElements = 0;
  page = 0;
  size = 10;
  sort = 'id';
  direction = 'asc';
  error: string = '';
  loading: boolean = false;
  customers: CustomerModel[] = [];
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
    this.loadBookings();
    this.loadAllData();
    this.searchSub = this.searchService.bookingSearch$.subscribe((query) => {
      this.searchQuery = query;
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
    }

  loadBookings() {
    this.loading = true;
    this.bookingService.getAllBookings(this.page, this.size, this.sort, this.direction)
      .subscribe((data) => {
        this.bookings = data.content;
        this.totalElements = data.totalElements;
        this.loading = false;
      }, () => {
        this.error = 'Failed to load bookings';
        this.loading = false;
      });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadBookings();
  }

  onSortChange(sort: string, direction: string) {
    this.sort = sort;
    this.direction = direction;
    this.loadBookings();
    }

  loadAllData() {
    this.customerService.getAll(0, 10, 'id', 'asc').subscribe((data: PageResponse<CustomerModel>) => this.customers = data.content);
    this.vehicleService.getAll(0, 10, 'id', 'asc').subscribe(data => this.vehicles = data.content);
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
    if (this.formBooking.id) {
      this.bookingService.update(this.formBooking).subscribe(() => this.loadBookings());
    } else {
      this.bookingService.create(this.formBooking).subscribe(() => this.loadBookings());
      this.closeModal();
    }
  }

  deleteBooking(id?: number) {
    if (id === undefined) return;
    this.bookingService.delete(id).subscribe(() => this.loadBookings());
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
