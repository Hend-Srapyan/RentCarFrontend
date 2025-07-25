import { Component, OnInit, OnDestroy } from '@angular/core';
import { VehicleService } from '../../service/vehicle.service';
import { VehicleModel } from '../../model/vehicle.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../service/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.html',
  styleUrls: ['./vehicles.css']
})
export class Vehicles implements OnInit, OnDestroy {
  cars: VehicleModel[] = [];
  totalElements = 0;
  page = 0;
  size = 4;
  sort = 'id';
  direction = 'asc';
  showModal = false;
  isEditMode = false;
  editCar: VehicleModel | null = null;
  loading = false;
  error: string | null = null;
  imageFile: File | null = null;
  searchQuery: string = '';

  vehiclesFormData: VehicleModel = {
    brand: '',
    model: '',
    year: 0,
    color: '',
    dailyRate: 0,
    regNo: '',
    image: ''
  };

  private searchSub?: Subscription;

  constructor(private vehicleService: VehicleService, private searchService: SearchService) {}

  ngOnInit() {
    this.loadCars();
    this.searchSub = this.searchService.vehiclesSearch$.subscribe((query) => {
      this.searchQuery = query;
      this.onSearch();
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  loadCars() {
    this.loading = true;
    this.vehicleService.getAll(this.page, this.size, this.sort, this.direction)
      .subscribe((data) => {
        this.cars = data.content;
        this.totalElements = data.totalElements;
        this.loading = false;
      }, () => {
        this.error = 'Failed to load vehicles';
        this.loading = false;
      });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.vehicleService.searchVehicles(this.searchQuery).subscribe({
        next: (cars) => {
          this.cars = cars;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to search vehicles';
          this.loading = false;
        }
      });
    } else {
      this.loadCars();
    }
  }

  openAddModal() {
    this.resetForm();
    this.isEditMode = false;
    this.showModal = true;
  }

  openEditModal(car: VehicleModel) {
    this.vehiclesFormData = { ...car };
    this.isEditMode = true;
    this.editCar = car;
    this.showModal = true;
  }

  saveCar() {
    this.error = null;

    if (!this.imageFile && !this.isEditMode) {
      this.error = 'Please select an image for the car!';
      return;
    }

    const v = this.vehiclesFormData;
    if (!v.brand || !v.model || !v.year || !v.color || !v.dailyRate || !v.regNo) {
      this.error = 'Please fill in all fields!';
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append(
      'vehicle',
      new Blob([JSON.stringify(this.vehiclesFormData)], { type: 'application/json' })
    );

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    if (this.isEditMode && this.editCar) {
      this.vehicleService.updateVehicle(formData).subscribe({
        next: () => {
          this.loadCars();
          this.showModal = false;
          this.resetForm();
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to update vehicle';
          this.loading = false;
        }
      });

    } else {
      if (!this.imageFile) {
        this.error = 'Image file is required!';
        this.loading = false;
        return;
      }

      this.vehicleService.addVehicle(formData).subscribe({
        next: () => {
          this.loadCars();
          this.showModal = false;
          this.resetForm();
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to add vehicle';
          this.loading = false;
        }
      });
    }
  }

  deleteCar(car: VehicleModel) {
    if (car.id !== undefined) {
      this.loading = true;
      this.vehicleService.deleteVehicle(car.id).subscribe({
        next: () => {
          this.loadCars();
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to delete vehicle';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Vehicle ID is missing!';
    }
  }

  resetForm() {
    this.vehiclesFormData = {
      brand: '',
      model: '',
      year: 0,
      color: '',
      dailyRate: 0,
      regNo: '',
      image: ''
    };
    this.editCar = null;
    this.isEditMode = false;
    this.imageFile = null;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.vehiclesFormData['image'] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  filteredCars() {
    if (!this.searchQuery) {
      return this.cars;
    }
    const text = this.searchQuery.toLowerCase();
    return this.cars.filter(car =>
      (car.brand && car.brand.toLowerCase().includes(text)) ||
      (car.model && car.model.toLowerCase().includes(text)) ||
      (car.year && car.year.toString().includes(text)) ||
      (car.color && car.color.toLowerCase().includes(text)) ||
      (car.dailyRate && car.dailyRate.toString().includes(text)) ||
      (car.regNo && car.regNo.toLowerCase().includes(text))
    );
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadCars();
  }

  onSortChange(sort: string, direction: string) {
    this.sort = sort;
    this.direction = direction;
    this.loadCars();
  }
}
