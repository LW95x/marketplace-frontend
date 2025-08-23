import { Component } from '@angular/core';
import { SavedItem } from 'src/app/models/saved-item.model';
import { ProductsService } from 'src/app/services/products.service';
import { SavedItemsService } from 'src/app/services/saved-items.service';

@Component({
  selector: 'app-saved-items',
  templateUrl: './saved-items.component.html',
  styleUrls: ['./saved-items.component.css']
})
export class SavedItemsComponent {
  savedItems: SavedItem[] | null = null;

  constructor(
    private savedItemService: SavedItemsService,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    this.loadSavedItems();
  }

  loadSavedItems(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.savedItemService.getSavedItems(userId).subscribe({
        next: (data) => {
          this.savedItems = data;

          this.savedItems.forEach((item) => {
            this.productService.getProductById(item.productId).subscribe({
              next: (product) => {
                item.sellerId = product.sellerId;
              }
            })
          })
          
        },
        error: (err) => console.error('Could not find users saved item list', err),
      });
    }
  }

  handleDeleteSavedItem(productId: string): void {
      const userId = localStorage.getItem('userId');

      if (userId) {
        this.savedItemService.deleteSavedItem(userId, productId).subscribe({
          next: () => {
            if (this.savedItems) {
              this.savedItems = this.savedItems.filter( 
                (item) => item.productId !== productId);
            }
            console.log('Saved Item was succesfully deleted.');
          },
          error: (err) => {
            console.log('Failed to delete saved item.', err);
          }
        })
      }
    } 



}
