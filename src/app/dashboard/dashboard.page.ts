import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, ModalController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { ReceiptModalComponent } from '../components/receipt-modal/receipt-modal.component';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';


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
  quantity: number = 0;
  userName: string = '';
  todayDate = new Date();
  activeSegment = 'all';
  searchQuery: string = '';
  selectedItems: any[] = [];
  bulkQuantityChange: number = 1;
  paymentProcessing: boolean = false;

  // Payment properties
  paymentMethods = [
    { id: 'cash', name: 'Cash', icon: 'cash-outline' },
    { id: 'credit_card', name: 'Credit Card', icon: 'card-outline' },
    { id: 'gcash', name: 'GCash', icon: 'phone-portrait-outline' },
    { id: 'paymaya', name: 'PayMaya', icon: 'wallet-outline' }
  ];
  selectedPaymentMethod: string = 'cash';
  showPaymentModal: boolean = false;
  paymentAmount: number = 0;
  paymentChange: number = 0;
  transactionHistory: any[] = [];

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
      title: 'Today\'s Sales',
      value: 0,
      icon: 'trending-up-outline',
      color: 'primary'
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

  // Inventory data
  vegetables = [
    { 
      id: 1,
      name: 'Organic Carrots', 
      manufactureDate: '2023-10-15', 
      quantity: 0, 
      price: 25.50, 
      image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979', 
      category: 'vegetables', 
      threshold: 0,
      unit: 'kg'
    },
    { 
      id: 2,
      name: 'Heirloom Tomatoes', 
      manufactureDate: '2023-10-16', 
      quantity: 0, 
      price: 40.25, 
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa', 
      category: 'vegetables',
      threshold: 0,
      unit: 'kg'
    },
    { 
      id: 5,
      name: 'Organic Spinach', 
      manufactureDate: '2023-10-17', 
      quantity: 0, 
      price: 35.75, 
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb', 
      category: 'vegetables',
      threshold: 0,
      unit: 'kg'
    },
    { 
      id: 6,
      name: 'Bell Peppers', 
      manufactureDate: '2023-10-18', 
      quantity: 0, 
      price: 28.90, 
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa0c', 
      category: 'vegetables',
      threshold: 0,
      unit: 'kg'
    },
    { 
      id: 7,
      name: 'Broccoli', 
      manufactureDate: '2023-10-19', 
      quantity: 0, 
      price: 32.40, 
      image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c', 
      category: 'vegetables',
      threshold: 0,
      unit: 'kg'
    },
    { 
      id: 8,
      name: 'Organic Potatoes', 
      manufactureDate: '2023-10-20', 
      quantity: 0, 
      price: 18.75, 
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655', 
      category: 'vegetables',
      threshold: 0,
      unit: 'kg'
    }
  ];

  meats = [
    { 
      id: 3,
      name: 'Premium Chicken Breast', 
      manufactureDate: '2023-10-14', 
      quantity: 0, 
      price: 120.75, 
      image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143', 
      category: 'meats',
      threshold: 0,
      unit: 'kg'
    },
    { 
      id: 4,
      name: 'Heritage Pork Belly', 
      manufactureDate: '2023-10-13', 
      quantity: 0, 
      price: 180.99, 
      image: 'https://images.unsplash.com/photo-1550949983-8b93d9243e7e', 
      category: 'meats',
      threshold: 0,
      unit: 'kg'
    },
    { 
      id: 9,
      name: 'Grass-Fed Beef Steak', 
      manufactureDate: '2023-10-21', 
      quantity: 0, 
      price: 250.50, 
      image: 'https://images.unsplash.com/photo-1603362102297-7b7e5a9b0b24', 
      category: 'meats',
      threshold: 0,
      unit: 'kg'
    },
    { 
      id: 10,
      name: 'Free-Range Chicken Thighs', 
      manufactureDate: '2023-10-22', 
      quantity: 0, 
      price: 95.25, 
      image: 'https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3', 
      category: 'meats',
      threshold: 0,
      unit: 'kg'
    },
    { 
      id: 11,
      name: 'Organic Lamb Chops', 
      manufactureDate: '2023-10-23', 
      quantity: 0, 
      price: 320.00, 
      image: 'https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3', 
      category: 'meats',
      threshold: 0,
      unit: 'kg'
    },
    { 
      id: 12,
      name: 'Turkey Breast', 
      manufactureDate: '2023-10-24', 
      quantity: 0, 
      price: 145.75, 
      image: 'https://images.unsplash.com/photo-1603048719539-9ecb4aa395e3', 
      category: 'meats',
      threshold: 0,
      unit: 'kg'
    }
  ];

  filteredVegetables = [...this.vegetables];
  filteredMeats = [...this.meats];
  filteredProducts: any[] = [];

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private modalCtrl: ModalController,
    private router: Router,
    private firestore: AngularFirestore
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

  // Payment Methods
  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
  }

  calculatePaymentChange() {
    const total = this.getSelectedTotalPrice();
    this.paymentChange = this.paymentAmount - total;
    return this.paymentChange;
  }

  openPaymentModal() {
    if (this.selectedItems.length === 0) {
      this.presentToast('Please select items first', 'warning');
      return;
    }
    this.paymentAmount = this.getSelectedTotalPrice();
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.paymentAmount = 0;
    this.paymentChange = 0;
  }

  async confirmPayment() {
    if (this.paymentAmount < this.getSelectedTotalPrice()) {
      this.presentToast('Payment amount is insufficient', 'warning');
      return;
    }

    this.paymentProcessing = true;
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Record the transaction
      const transaction = {
        id: Date.now(),
        date: new Date(),
        items: [...this.selectedItems],
        paymentMethod: this.selectedPaymentMethod,
        amountPaid: this.paymentAmount,
        change: this.paymentChange,
        total: this.getSelectedTotalPrice(),
        customerName: 'Walk-in Customer'
      };
      
      this.transactionHistory.unshift(transaction);
      
      // Update inventory
      this.selectedItems.forEach(item => {
        const inventoryItem = [...this.vegetables, ...this.meats].find(i => i.id === item.id);
        if (inventoryItem) {
          inventoryItem.quantity -= item.quantity;
        }
      });
      
      this.presentToast(`Payment of ${this.formatPrice(this.paymentAmount)} processed`, 'success');
      this.showPaymentModal = false;
      
      // Show receipt
      await this.showReceipt(transaction);
      
      this.selectedItems = [];
      this.updateSummaryCards();
    } catch (error) {
      this.presentToast('Payment processing failed', 'danger');
    } finally {
      this.paymentProcessing = false;
    }
  }

  async showReceipt(transaction: any) {
    const modal = await this.modalCtrl.create({
      component: ReceiptModalComponent,
      componentProps: {
        transaction: transaction
      }
    });
    await modal.present();
  }

  // Inventory Management Methods
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

updateQuantity(item: any, change: number): void {
  item.quantity += change;
  if (item.quantity < 0) {
    item.quantity = 0;
  }
  
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

  // Updated summary cards to include sales data
  private updateSummaryCards() {
    const todaySales = this.getTodaysSales();
    
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
        title: 'Today\'s Sales',
        value: todaySales,
        icon: 'trending-up-outline',
        color: 'primary'
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

  getTodaysSales(): number {
    const today = new Date().toDateString();
    return this.transactionHistory
      .filter(t => new Date(t.date).toDateString() === today)
      .reduce((total, t) => total + t.total, 0);
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

  // ...


  logout() {
    this.authService.logout().subscribe(() => {
      this.presentToast('Logged out successfully', 'success');
    });
  }


  // Alias for payment processing
  
  addItem(item: any) {
    const existingItem = this.selectedItems.find(i => i.name === item.name);
    if (existingItem) {
      existingItem.quantity += this.quantity;
    } else {
      this.selectedItems.push({ ...item, quantity: this.quantity });
    }
    this.quantity = 0; // Reset quantity
  }

  processPayment() {
    const total = this.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.router.navigate(['/transaction'], {
      state: { transactions: [{ items: this.selectedItems, total }] }
    });
  }

  
}