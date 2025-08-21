import { Component } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders: Order[] = [];

  constructor(private orderService: OrdersService, private productService: ProductsService) {}

  ngOnInit() {
    this.loadUserOrders();
  }

  loadUserOrders(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.orderService.getOrdersByUserId(userId).subscribe({
        next: (data) => {
          const sortedData = [...data].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          this.orders = sortedData;
          console.log('User orders fetched succesfully');
          
          this.orders.forEach((order) => {
            order.orderItems.forEach((orderItem) => {
              this.productService.getProductById(orderItem.productId).subscribe({
                next: (product) => {
                  orderItem.productTitle = product.title;
                  orderItem.productDescription = product.description;
                  orderItem.imageUrls = product.imageUrls;
                  orderItem.productSellerName = product.sellerName;
                  orderItem.productCategory = product.category;
                  orderItem.productSellerId = product.sellerId;
                },
                error: (err) => console.error(err),
              })
            })
          })
        },
        error: (err) => console.error('Failed to find user orders', err),
      });
    }
  }
}
