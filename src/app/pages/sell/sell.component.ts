import { Component } from '@angular/core';
import { CreateProduct } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
})
export class SellComponent {
  categories: string[] = [
    'Electronics',
    'Sport',
    'Furniture',
    'Food & Drink',
    'Clothing',
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
  title: string = '';
  description: string = '';
  quantity: number = 1;
  price: number = 1;
  deliveryFee: number = 1;

  selectedCategory: string = '';
  selectedCondition: string = '';
  selectedReturn: string = '';
  formattedProductPrice: string = '£0.00';
  formattedDeliveryFee: string = '£0.00';
  imagePreviews: string[] = [];
  productImages: string[] = [];

  private blobClient: HttpClient;

  constructor(private productService: ProductsService, handler: HttpBackend) {
    this.blobClient = new HttpClient(handler);
  }

  onImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files);

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          this.imagePreviews.push(result);

          this.uploadImage(file);
        };

        reader.readAsDataURL(file);
      });
    }
  }

  uploadImage(file: File): void {
    const fileName = `${Date.now()}-${file.name}`;
    const sasToken =
      'sv=2024-11-04&ss=b&srt=o&sp=wc&se=2027-07-28T18:13:04Z&st=2025-07-28T09:58:04Z&spr=https,http&sig=uB8VbdTVfTMTxklGHPIhoWZxypBPo2PXY8Y5u7q1B%2F8%3D';
    const blobUrl = `https://marketplaceapistorage.blob.core.windows.net/user-avatars/${fileName}?${sasToken}`;

    const headers = new HttpHeaders({
      'x-ms-blob-type': 'BlockBlob',
      'x-ms-version': '2024-11-04',
      'Content-Type': file.type,
    });

    this.blobClient.put(blobUrl, file, { headers }).subscribe({
      next: () => {
        console.log('Image was uploaded to storage successfully.');
        const publicUrl = `https://marketplaceapistorage.blob.core.windows.net/user-avatars/${fileName}`;
        this.productImages.push(publicUrl);
      },
      error: (err: Error) => {
        console.error('Image upload failed,', err);
      },
    });
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  formatProductPrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d.]/g, '');

    if (value) {
      this.price = Number(value);
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
      this.deliveryFee = Number(value);
      const parsedValue = parseFloat(value).toFixed(2);
      this.formattedDeliveryFee = `£${parsedValue}`;
    } else {
      this.formattedDeliveryFee = '£0.00';
    }

    input.value = this.formattedDeliveryFee;
  }

  create(): void {
    const userId = localStorage.getItem('userId');

    const newProduct: CreateProduct = {
      title: this.title,
      description: this.description,
      price: this.price,
      quantity: this.quantity,
      category: this.selectedCategory,
      imageUrls: this.productImages,
      condition: this.selectedCondition,
      deliveryFee: this.deliveryFee,
      allowReturns: Boolean(this.selectedReturn)
    };

    console.log(newProduct);

    if (userId) {
      this.productService.addNewProduct(userId, newProduct).subscribe({
        next: () => {
          console.log('User product was successfully created.');
        },
        error: (err) => {
          console.error('Failed to create new user product.', err);
        }
      })
    }
  }
}
