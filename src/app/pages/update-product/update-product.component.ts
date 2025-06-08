import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Product, UpdateProduct } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
})
export class UpdateProductComponent {
  categories: string[] = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sport',
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
  productForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(this.productId).subscribe({
      next: (data) => (
        (this.product = data), (this.existingImageUrls = this.product.imageUrls)
      ),
      error: (err) => console.error('Product ID couldnt be found:', err),
    });
  }

  update(): void {
    const userId = localStorage.getItem('userId');
    
    const formValues = this.productForm.value;
    const jsonPatchDocuments: UpdateProduct[] = [];

    for (const [field, value] of Object.entries(formValues)) {
      jsonPatchDocuments.push({
        op: 'replace',
        path: `/${field}`,
        value
      });
    }

    const combinedImagesArray = [
      ...this.existingImageUrls,
      ...this.imagePreviews
    ];

    jsonPatchDocuments.push({
      op: 'replace',
      path: `/images`,
      value: combinedImagesArray
    })

    const jsonPatchDocument: UpdateProduct[] = [{
      op: 'replace',
      path: '/',
      value: ''
    }]

    if (userId) {
      this.productService.updateProduct(userId, this.productId, )
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
        };

        reader.readAsDataURL(file);
      });
    }
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
