import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TransactionPage {
  transactions: any[] = [
    {
      id: 1,
      date: new Date('2023-05-15'),
      items: [
        { name: 'Organic Carrots', quantity: 2, price: 25.50 },
        { name: 'Premium Chicken', quantity: 1, price: 120.75 }
      ],
      total: 171.75,
      paymentMethod: 'GCash'
    },
    // Add more sample transactions as needed
  ];

  constructor() {}

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  }
}