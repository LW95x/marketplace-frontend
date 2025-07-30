import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent {
  @Input() images: string[] = [];
  @Input() placeholder = 'https://placehold.co/200x200';
  current = 0;

  previous() {
    if (this.images.length === 0) return;
    this.current = (this.current - 1 + this.images.length) % this.images.length;
  }

  next() {
    if (this.images.length === 0) return;
    this.current = (this.current + 1) % this.images.length;
  }
}
