import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  quantity = 1;

  increment() {
    this.quantity++;
  }
  
  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
