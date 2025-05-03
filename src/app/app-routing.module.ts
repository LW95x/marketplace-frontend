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
  { path: 'orders', component: OrdersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
