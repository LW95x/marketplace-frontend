import { Component } from '@angular/core';
import { SoldItem } from 'src/app/models/order-item.model';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-sold-items',
  templateUrl: './sold-items.component.html',
  styleUrls: ['./sold-items.component.css'],
})
export class SoldItemsComponent {
  soldItems: SoldItem[] = [];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.loadSoldItems();
  }

  loadSoldItems(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.ordersService.getSavedItems(userId).subscribe({
        next: (data) => {
          this.soldItems = data;
          console.log('Saved Items succesfully loaded.');
        },
        error: (err) => console.error('Saved Items could not be found.', err),
      });
    }
  }
}
