import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductsComponent } from './pages/products/products.component';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductComponent } from './pages/product/product.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CartComponent } from './pages/cart/cart.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
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
import { ConversationComponent } from './pages/conversation/conversation.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { UpdateProductComponent } from './pages/update-product/update-product.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ProductsComponent,
    FooterComponent,
    ProductComponent,
    ProfileComponent,
    CartComponent,
    SellComponent,
    LoginRegisterComponent,
    PasswordResetComponent,
    UserProductsComponent,
    OrdersComponent,
    CheckoutComponent,
    ChangePasswordComponent,
    ChangeEmailComponent,
    ChangeAvatarComponent,
    SavedItemsComponent,
    SoldItemsComponent,
    MessagesComponent,
    ConversationComponent,
    NotificationsComponent,
    UpdateProductComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    [FontAwesomeModule],
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
