import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { SearchService } from '../../service/search.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.css']
})
export class Layout {
  isCustomerPage: boolean = false;
  isVehiclesPage: boolean = false;
  isBookingPage: boolean = false;
  isDashboardPage: boolean = false;
  navbarSearchText: string = '';

  constructor(private searchService: SearchService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCustomerPage = event.urlAfterRedirects.startsWith('/customer');
        this.isVehiclesPage = event.urlAfterRedirects.startsWith('/vehicles');
        this.isBookingPage = event.urlAfterRedirects.startsWith('/booking');
        this.isDashboardPage = event.urlAfterRedirects === '/dashboard';
      }
    });

    const url = this.router.url;
    this.isCustomerPage = url.startsWith('/customer');
    this.isVehiclesPage = url.startsWith('/vehicles');
    this.isBookingPage = url.startsWith('/booking');
    this.isDashboardPage = url === '/dashboard';
  }

  onCustomerSearch(text: string) {
    this.searchService.setCustomerSearch(text);
  }

  onVehiclesSearch(text: string) {
    this.searchService.setVehiclesSearch(text);
  }

  onBookingSearch(text: string) {
    this.searchService.setBookingSearch(text);
  }

  logout() {
    this.router.navigateByUrl('/login');
  }
}
