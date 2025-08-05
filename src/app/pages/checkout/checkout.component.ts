import { Component, ViewChild } from '@angular/core';
import { StripeCardElementOptions, StripeElement, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { CreateOrder } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  elementsOptions: StripeElementsOptions = { locale: 'en-GB' };
  cardOptions: StripeCardElementOptions = { 
    hidePostalCode: false,   
    style: { base: { fontSize: '16px '}}
  };
  address: string = '';

  isLoading = false;
  paymentError: string | null = null;
  isSuccess = false;

  constructor(private stripeService: StripeService, private orderService: OrdersService) {}

  pay() {
    const userId = localStorage.getItem('userId');

    this.stripeService.createPaymentMethod({
      type: 'card',
      card: this.card.element!
    })
    .subscribe(({ paymentMethod, error }) => {
      if (error || !paymentMethod) {
        this.paymentError = error?.message ?? 'Card authentication failed.';
        return;
      }

    const orderDto: CreateOrder = {
      address: this.address,
      stripePaymentId: paymentMethod.id
    }

    if (userId) {

      this.orderService.addNewOrder(userId, orderDto).subscribe({
        next: () => {
          console.log('Order was successfully created.');
        },
        error: (err) => {
          console.error('Order was not created.', err);
        }
      })
    }
    })


  }
}
