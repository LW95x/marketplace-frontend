import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductComponent } from './pages/product/product.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CartComponent } from './pages/cart/cart.component';
import { SellComponent } from './pages/sell/sell.component';
import { LoginRegisterComponent } from './pages/login-register/login-register.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { UserProductsComponent } from './pages/user-products/user-products.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ChangeEmailComponent } from './pages/change-email/change-email.component';
import { ChangeAvatarComponent } from './pages/change-avatar/change-avatar.component';
import { SavedItemsComponent } from './pages/saved-items/saved-items.component';
import { SoldItemsComponent } from './pages/sold-items/sold-items.component';
import { MessagesComponent } from './pages/messages/messages.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'cart', component: CartComponent },
  { path: 'sell', component: SellComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'user-products', component: UserProductsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'change-email', component: ChangeEmailComponent },
  { path: 'change-avatar', component: ChangeAvatarComponent },
  { path: 'saved-items', component: SavedItemsComponent },
  { path: 'sold-items', component: SoldItemsComponent },
  { path: 'messages', component: MessagesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
