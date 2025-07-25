import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../service/booking.service';
import { CustomerService } from '../../service/customer.service';
import { BookingModel } from '../../model/booking.model';
import { PageResponse } from '../../model/page-response.model';
import { Customer } from '../../service/customer.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  showModal = false;
  showFilterBlock = false;

  bookings: BookingModel[] = [];
  customers: any[] = [];
  filteredBookings: BookingModel[] = [];

  bookingsCount = 0;
  customersCount = 0;
  revenue = 0;

  filterType: 'all' | 'day' | 'month' | 'year' = 'all';
  filterDate: string = '';

  constructor(private bookingService: BookingService, private customerService: CustomerService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.bookingService.getAllBookings(0, 10, 'id', 'asc').subscribe((bookings: PageResponse<BookingModel>) => {
      this.bookings = bookings.content;
      this.applyFilter();
    });
    this.customerService.getAll(0, 10, 'id', 'asc').subscribe((customers: PageResponse<Customer>) => {
      this.customers = customers.content;
    });
  }

  applyFilter() {
    let filtered = this.bookings;
    if (this.filterType !== 'all' && this.filterDate) {
      filtered = this.bookings.filter(b => {
        const date = new Date(b.dateFrom!);
        if (this.filterType === 'day') {
          const filter = new Date(this.filterDate);
          return date.toDateString() === filter.toDateString();
        } else if (this.filterType === 'month') {
          const [year, month] = this.filterDate.split('-').map(Number);
          return date.getFullYear() === year && date.getMonth() + 1 === month;
        } else if (this.filterType === 'year') {
          const year = Number(this.filterDate);
          return date.getFullYear() === year;
        }
        return true;
      });
    }
    this.filteredBookings = filtered;
    this.bookingsCount = filtered.length;
    this.revenue = filtered.reduce((sum, b) => sum + (b.total || 0), 0);
    this.customersCount = this.getUniqueCustomers(filtered).length;
  }

  getUniqueCustomers(bookings: BookingModel[]): string[] {
    const names = bookings.map(b => b.customer?.name || '');
    return Array.from(new Set(names));
  }

  getAvailableYears(): number[] {
    if (!this.bookings.length) return [];
    const years = this.bookings.map(b => new Date(b.dateFrom!).getFullYear());
    const minYear = Math.max(1900, Math.min(...years) - 25);
    const maxYear = Math.min(2100, Math.max(...years) + 25);
    const result: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      result.push(y);
    }
    return result;
  }

  setFilter(type: 'all' | 'day' | 'month' | 'year', date: string = '') {
    this.filterType = type;
    this.filterDate = date;
    this.applyFilter();
  }

  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; }
  openFilter() { this.showFilterBlock = !this.showFilterBlock;}
}
