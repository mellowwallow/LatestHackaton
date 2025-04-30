import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
/////////////////////////////////////////////
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class DashboardPage {
  userName: string = '';
  todayDate = new Date();
  activeSegment = 'all';
  searchQuery: string = '';
  selectedItems: any[] = [];
  bulkQuantityChange: number = 1;
  paymentProcessing: boolean = false;

  // Summary cards for dashboard
  summaryCards = [
    {
      title: 'Total Inventory Value',
      value: 0,
      icon: 'cash-outline',
      color: 'success'
    },
    {
      title: 'Low Stock Items',
      value: 0,
      icon: 'warning-outline',
      color: 'warning'
    },
    {
      title: 'Vegetables',
      value: 0,
      icon: 'leaf-outline',
      color: 'tertiary'
    },
    {
      title: 'Meats',
      value: 0,
      icon: 'nutrition-outline',
      color: 'danger'
    }
  ];

  // Combined products array
  filteredProducts: any[] = [];

  // Inventory data
  vegetables = [
    { 
      id: 1,
      name: 'Organic Carrots', 
      manufactureDate: '2023-10-15', 
      quantity: 50, 
      price: 25.50, 
      image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979', 
      category: 'vegetables', 
      threshold: 10,
      unit: 'kg'
    },
    { 
      id: 2,
      name: 'Heirloom Tomatoes', 
      manufactureDate: '2023-10-16', 
      quantity: 30, 
      price: 40.25, 
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa', 
      category: 'vegetables',
      threshold: 15,
      unit: 'kg'
    },
    { 
      id: 5,
      name: 'Organic Spinach', 
      manufactureDate: '2023-10-17', 
      quantity: 25, 
      price: 35.75, 
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb', 
      category: 'vegetables',
      threshold: 8,
      unit: 'kg'
    },
    { 
      id: 6,
      name: 'Bell Peppers', 
      manufactureDate: '2023-10-18', 
      quantity: 40, 
      price: 28.90, 
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa0c', 
      category: 'vegetables',
      threshold: 12,
      unit: 'kg'
    },
    { 
      id: 7,
      name: 'Broccoli', 
      manufactureDate: '2023-10-19', 
      quantity: 35, 
      price: 32.40, 
      image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c', 
      category: 'vegetables',
      threshold: 10,
      unit: 'kg'
    },
    { 
      id: 8,
      name: 'Organic Potatoes', 
      manufactureDate: '2023-10-20', 
      quantity: 60, 
      price: 18.75, 
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655', 
      category: 'vegetables',
      threshold: 20,
      unit: 'kg'
    }
  ];

  meats = [
    { 
      id: 3,
      name: 'Premium Chicken Breast', 
      manufactureDate: '2023-10-14', 
      quantity: 20, 
      price: 120.75, 
      image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143', 
      category: 'meats',
      threshold: 5,
      unit: 'kg'
    },
    { 
      id: 4,
      name: 'Heritage Pork Belly', 
      manufactureDate: '2023-10-13', 
      quantity: 15, 
      price: 180.99, 
      image: 'https://images.unsplash.com/photo-1550949983-8b93d9243e7e', 
      category: 'meats',
      threshold: 5,
      unit: 'kg'
    },
    { 
      id: 9,
      name: 'Grass-Fed Beef Steak', 
      manufactureDate: '2023-10-21', 
      quantity: 18, 
      price: 250.50, 
      image: 'https://images.unsplash.com/photo-1603362102297-7b7e5a9b0b24', 
      category: 'meats',
      threshold: 4,
      unit: 'kg'
    },
    { 
      id: 10,
      name: 'Free-Range Chicken Thighs', 
      manufactureDate: '2023-10-22', 
      quantity: 22, 
      price: 95.25, 
      image: 'https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3', 
      category: 'meats',
      threshold: 6,
      unit: 'kg'
    },
    { 
      id: 11,
      name: 'Organic Lamb Chops', 
      manufactureDate: '2023-10-23', 
      quantity: 12, 
      price: 320.00, 
      image: 'https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3', 
      category: 'meats',
      threshold: 3,
      unit: 'kg'
    },
    { 
      id: 12,
      name: 'Turkey Breast', 
      manufactureDate: '2023-10-24', 
      quantity: 15, 
      price: 145.75, 
      image: 'https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3', 
      category: 'meats',
      threshold: 5,
      unit: 'kg'
    }
  ];

  filteredVegetables = [...this.vegetables];
  filteredMeats = [...this.meats];

  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {
    this.loadUserName();
    this.initializeData();
  }

  private initializeData() {
    this.filteredProducts = [...this.vegetables, ...this.meats];
    this.updateSummaryCards();
  }

  private loadUserName() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.userName = user?.displayName || user?.email || 'Guest';
    });
  }

  private updateSummaryCards() {
    this.summaryCards = [
      {
        title: 'Total Inventory Value',
        value: this.getInventoryTotalValue(),
        icon: 'cash-outline',
        color: 'success'
      },
      {
        title: 'Low Stock Items',
        value: this.lowStockItems.length,
        icon: 'warning-outline',
        color: 'warning'
      },
      {
        title: 'Vegetables',
        value: this.getCategoryTotalQuantity(this.vegetables),
        icon: 'leaf-outline',
        color: 'tertiary'
      },
      {
        title: 'Meats',
        value: this.getCategoryTotalQuantity(this.meats),
        icon: 'nutrition-outline',
        color: 'danger'
      }
    ];
  }

  onSearchChange(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredVegetables = this.vegetables.filter(item => 
      item.name.toLowerCase().includes(query)
    );
    this.filteredMeats = this.meats.filter(item => 
      item.name.toLowerCase().includes(query)
    );
    this.updateFilteredProducts();
  }

  private updateFilteredProducts() {
    if (this.activeSegment === 'vegetables') {
      this.filteredProducts = [...this.filteredVegetables];
    } else if (this.activeSegment === 'meats') {
      this.filteredProducts = [...this.filteredMeats];
    } else {
      this.filteredProducts = [...this.filteredVegetables, ...this.filteredMeats];
    }
    this.updateSummaryCards();
  }

  segmentChanged(ev: CustomEvent) {
    this.activeSegment = ev.detail.value;
    this.selectedItems = [];
    this.updateFilteredProducts();
  }

  get filteredCategories() {
    if (this.activeSegment === 'vegetables') {
      return [{ name: 'Fresh Vegetables', items: this.filteredVegetables, type: 'vegetables' }];
    } else if (this.activeSegment === 'meats') {
      return [{ name: 'Fresh Meats', items: this.filteredMeats, type: 'meats' }];
    } else {
      return [
        { name: 'Fresh Vegetables', items: this.filteredVegetables, type: 'vegetables' },
        { name: 'Fresh Meats', items: this.filteredMeats, type: 'meats' }
      ];
    }
  }

  areAllCategoryItemsSelected(items: any[]): boolean {
    return items.length > 0 && items.every(item => this.isItemSelected(item));
  }

  toggleSelectAllCategoryItems(items: any[], isSelected: boolean) {
    if (isSelected) {
      items.forEach(item => {
        if (!this.isItemSelected(item)) {
          this.selectedItems.push(item);
        }
      });
    } else {
      this.selectedItems = this.selectedItems.filter(
        selected => !items.some(item => item.id === selected.id)
      );
    }
  }

  getCategoryTotalQuantity(items: any[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  getCategoryThreshold(items: any[]): number {
    return items.length > 0 ? Math.min(...items.map(item => item.threshold)) : 0;
  }

  isItemSelected(item: any): boolean {
    return this.selectedItems.some(i => i.id === item.id);
  }

  toggleItemSelection(item: any) {
    const index = this.selectedItems.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
  }

  updateQuantity(item: any, change: number) {
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 0) {
      this.presentToast('Quantity cannot be negative', 'warning');
      return;
    }
    
    item.quantity = newQuantity;
    this.saveQuantityChange(item);
    this.updateSummaryCards();
  }

  private saveQuantityChange(item: any) {
    console.log(`Saving new quantity for ${item.name}: ${item.quantity}`);
    this.presentToast(`${item.name} updated to ${item.quantity} ${item.unit}`, 'success');
  }

  getQuantityColor(quantity: number, threshold: number): string {
    if (quantity <= threshold * 0.3) return 'danger';
    if (quantity <= threshold) return 'warning';
    return 'success';
  }

  get lowStockItems() {
    return [
      ...this.vegetables.filter(item => item.quantity <= item.threshold),
      ...this.meats.filter(item => item.quantity <= item.threshold)
    ];
  }

  getInventoryTotalValue(): number {
    return [
      ...this.vegetables,
      ...this.meats
    ].reduce((total, item) => total + (item.quantity * item.price), 0);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(price);
  }

  async processPayment() {
    if (this.selectedItems.length === 0) {
      this.presentToast('Please select items to purchase', 'warning');
      return;
    }

    this.paymentProcessing = true;
    const total = this.getSelectedTotalPrice();

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.presentToast(`Payment successful: ${this.formatPrice(total)}`, 'success');
      this.selectedItems = [];
    } catch (error) {
      this.presentToast('Payment failed. Please try again.', 'danger');
    } finally {
      this.paymentProcessing = false;
    }
  }

  getSelectedTotalPrice(): number {
    return this.selectedItems.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  }

  getSelectedTotalQuantity(): number {
    return this.selectedItems.reduce((total, item) => total + item.quantity, 0);
  }

  syncInventory() {
    console.log('Syncing inventory...');
    this.presentToast('Inventory synced', 'success');
  }

  async presentToast(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.presentToast('Logged out successfully', 'success');
    });
  }
}