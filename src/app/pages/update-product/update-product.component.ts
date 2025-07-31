import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, UpdateProduct } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
})
export class UpdateProductComponent {
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
  returns = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  productId!: string;
  product!: Product;
  selectedCategory: string = '';
  selectedCondition: string = '';
  selectedReturn: string = '';
  formattedProductPrice: string = '£0.00';
  formattedDeliveryFee: string = '£0.00';
  imagePreviews: string[] = [];
  existingImageUrls: string[] = [];

  private blobClient: HttpClient;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private http: HttpClient,
    handler: HttpBackend
  ) {
    this.blobClient = new HttpClient(handler);
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(this.productId).subscribe({
      next: (data) => (
        (this.product = data),
        (this.existingImageUrls = this.product.imageUrls),
        (this.formattedDeliveryFee = `£${this.product.deliveryFee.toFixed(2)}`),
        (this.formattedProductPrice = `£${this.product.price?.toFixed(2)}`)
      ),
      error: (err) => console.error('Product ID couldnt be found:', err),
    });
  }

  update(): void {
    const userId = localStorage.getItem('userId');

    const jsonPatchDocuments: UpdateProduct[] = [
      { op: 'replace', path: '/title', value: this.product.title },
      { op: 'replace', path: '/description', value: this.product.description },
      { op: 'replace', path: '/price', value: this.product.price },
      { op: 'replace', path: '/quantity', value: this.product.quantity },
      { op: 'replace', path: '/category', value: this.product.category },
      { op: 'replace', path: '/condition', value: this.product.condition },
      { op: 'replace', path: '/deliveryFee', value: this.product.deliveryFee },
      {
        op: 'replace',
        path: '/allowReturns',
        value: this.product.allowReturns,
      },
      { op: 'replace', path: '/imageUrls', value: this.product.imageUrls },
    ];

    if (userId) {
      this.productService
        .updateProduct(userId, this.productId, jsonPatchDocuments)
        .subscribe({
          next: () => {
            console.log('User product was succesfully updated.');
          },
          error: (err) => {
            console.error('Failed to update user product.', err);
          },
        });
    }
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
        this.product.imageUrls.push(publicUrl);
      },
      error: (err: Error) => {
        console.error('Image upload failed,', err);
      },
    });
  }

  removeExistingImage(index: number): void {
    this.existingImageUrls.splice(index, 1);
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
  }

  formatProductPrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d.]/g, '');

    if (value) {
      const parsedValue = parseFloat(value);
      this.formattedProductPrice = `£${parsedValue.toFixed(2)}`;
      this.product.price = parsedValue;
    } else {
      this.formattedProductPrice = '£0.00';
      this.product.deliveryFee = 0;
    }

    input.value = this.formattedProductPrice;
  }

  formatDeliveryFee(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^\d.]/g, '');

    if (value) {
      const parsedValue = parseFloat(value);
      this.formattedDeliveryFee = `£${parsedValue.toFixed(2)}`;
      this.product.deliveryFee = parsedValue;
    } else {
      this.formattedDeliveryFee = '£0.00';
      this.product.deliveryFee = 0;
    }

    input.value = this.formattedDeliveryFee;
  }
}
