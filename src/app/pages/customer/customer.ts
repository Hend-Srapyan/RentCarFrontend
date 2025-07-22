import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SearchService} from '../../service/search.service';
import {Subscription} from 'rxjs';
import {Customer, CustomerService} from '../../service/customer.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css']
})

export class CustomerComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];
  showModal = false;
  formCustomer: Customer = { name: '', city: '', mobile: '', email: '' };
  searchText: string = '';
  private searchSub: Subscription;
  editCustomer: Customer | null = null;

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
    this.customerService.getAll().subscribe(data => this.customers = data);
  }

  openAddModal() {
    this.formCustomer = { name: '', city: '', mobile: '', email: '' };
    this.editCustomer = null;
    this.showModal = true;
  }

  openEditModal(customer: Customer) {
    this.formCustomer = { ...customer };
    this.editCustomer = customer;
    this.showModal = true;
  }

  saveCustomer() {
    if (this.editCustomer) {
      this.customerService.update(this.formCustomer).subscribe(() => {
        this.loadCustomers();
        this.closeModal();
      });
    } else {
      this.customerService.create(this.formCustomer).subscribe(() => {
        this.loadCustomers();
        this.closeModal();
      });
    }
  }

  deleteCustomer(customer: Customer) {
    if (customer.id) {
      this.customerService.delete(customer.id).subscribe(() => this.loadCustomers());
    }
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
}
export { CustomerComponent as Customer };
