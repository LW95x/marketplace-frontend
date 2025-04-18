import { ReadVarExpr } from '@angular/compiler';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
})
export class SellComponent {
  categories: string[] = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Toys',
    'Books',
  ];
  conditions: string[] = [
    'New',
    'New (other)',
    'Refurbished (Excellent)',
    'Refurbished (Good)',
    'Used (Excellent)',
    'Used (Fair)',
    'Used (Ok)',
    'For parts/Not working',
  ];
  returns: string[] = ['Yes', 'No'];

  selectedCategory: string = '';
  selectedCondition: string = '';
  selectedReturn: string = '';
  formattedProductPrice: string = '£0.00';
  formattedDeliveryFee: string = '£0.00';
  imagePreviews: string[] = [];

  onImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          this.imagePreviews.push(result);
        };

        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  formatProductPrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d.]/g, '');

    if (value) {
      const parsedValue = parseFloat(value).toFixed(2);
      this.formattedProductPrice = `£${parsedValue}`;
    } else {
      this.formattedProductPrice = '£0.00';
    }

    input.value = this.formattedProductPrice;
  }

  formatDeliveryFee(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d.]/g, '');

    if (value) {
      const parsedValue = parseFloat(value).toFixed(2);
      this.formattedDeliveryFee = `£${parsedValue}`;
    } else {
      this.formattedDeliveryFee = '£0.00';
    }

    input.value = this.formattedDeliveryFee;
  }
}
