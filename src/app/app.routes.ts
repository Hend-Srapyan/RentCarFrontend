import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Vehicles } from './pages/vehicles/vehicles';
import { Customer} from './pages/customer/customer';
import { Booking } from './pages/booking/booking';
import { ReportsComponent } from './pages/reports/reports';
import { AboutComponent } from './pages/about/about';
import { PricingComponent } from './pages/pricing/pricing';
import { ContactsComponent } from './pages/contacts/contacts';
import { Registration } from './pages/registration/registration';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'registration',
    component: Registration
  },
  {
    path: '', component: Layout,
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'vehicles',
        component: Vehicles
      },
      {
        path: 'customer',
        component: Customer
      },
      {
        path: 'booking',
        component: Booking
      },
      {
        path: 'reports',
        component: ReportsComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'pricing',
        component: PricingComponent
      },
      {
        path: 'contacts',
        component: ContactsComponent
      },
    ]
  },
];
