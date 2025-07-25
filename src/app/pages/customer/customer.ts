import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SearchService} from '../../service/search.service';
import {Subscription} from 'rxjs';
import { CustomerService } from '../../service/customer.service';
import { CustomerModel } from '../../model/customer.model';
import { PageResponse } from '../../model/page-response.model';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css']
})

export class CustomerComponent implements OnInit, OnDestroy {
  customers: CustomerModel[] = [];
  totalElements = 0;
  page = 0;
  size = 10;
  sort = 'id';
  direction = 'asc';
  error: string = '';
  loading: boolean = false;
  showModal = false;
  formCustomer: CustomerModel = { name: '', city: '', mobile: '', email: '' };
  searchText: string = '';
  private searchSub: Subscription;
  editCustomer: CustomerModel | null = null;

  constructor(private searchService: SearchService, private customerService: CustomerService) {
    this.searchSub = this.searchService.customerSearch$.subscribe((text: string) => {
      this.searchText = text;
    });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getAll(this.page, this.size, this.sort, this.direction)
      .subscribe((data: PageResponse<CustomerModel>) => {
        this.customers = data.content;
        this.totalElements = data.totalElements;
        this.loading = false;
      }, () => {
        this.error = 'Failed to load customers';
        this.loading = false;
      });
  }

  openAddModal() {
    this.formCustomer = { name: '', city: '', mobile: '', email: '' };
    this.editCustomer = null;
    this.showModal = true;
  }

  openEditModal(customer: CustomerModel) {
    this.formCustomer = { ...customer };
    this.editCustomer = customer;
    this.showModal = true;
  }

  saveCustomer() {
    if (this.formCustomer.id) {
      this.customerService.update(this.formCustomer).subscribe(() => this.loadCustomers());
    } else {
      this.customerService.create(this.formCustomer).subscribe(() => this.loadCustomers());
      this.closeModal()
    }
  }

  deleteCustomer(id?: number) {
    if (id === undefined) return;
    this.customerService.delete(id).subscribe(() => this.loadCustomers());
  }

  closeModal() {
    this.showModal = false;
    this.editCustomer = null;
  }

  filteredCustomers() {
    if (!this.searchText) {
      return this.customers;
    }
    const text = this.searchText.toLowerCase();
    return this.customers.filter(c =>
      c.name.toLowerCase().includes(text) ||
      c.city.toLowerCase().includes(text) ||
      c.mobile.toLowerCase().includes(text) ||
      c.email.toLowerCase().includes(text)
    );
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadCustomers();
  }

  onSortChange(sort: string, direction: string) {
    this.sort = sort;
    this.direction = direction;
    this.loadCustomers();
  }
}
export { CustomerComponent as Customer };
