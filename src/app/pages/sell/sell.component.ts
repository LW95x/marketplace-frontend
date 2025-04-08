import { Component } from '@angular/core';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent {

  categories: string[] = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Toys', 'Books'];
  conditions: string[] = ['New', 'New (other)', 'Refurbished (Excellent)', 'Refurbished (Good)', 'Used (Excellent)', 'Used (Fair)', 'Used (Ok)', 'For parts/Not working'];
  returns: string[] = ['Yes', 'No'];
  
  selectedCategory: string = '';
  selectedCondition: string = '';
  selectedReturn: string = '';
  formattedValue: string = '£0.00';

  formatCurrency(event: Event): void {
    const input = (event.target as HTMLInputElement);
    let value = input.value.replace(/[^\d.]/g, '');

    if (value) {
      const parsedValue = parseFloat(value).toFixed(2);
      this.formattedValue = `£${parsedValue}`;
    } else {
      this.formattedValue = '£0.00';
    }

    input.value = this.formattedValue;
  }
}
