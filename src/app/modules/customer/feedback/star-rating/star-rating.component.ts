import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'star-rating',
    standalone: true,
    templateUrl: './star-rating.component.html',
    imports: [CommonModule, MatIconModule]
})
export class StarRatingComponent implements OnChanges {
    @Input() rating: number;
    stars: boolean[] = [];

    ngOnChanges(): void {
        this.stars = Array(5).fill(false).map((_, i) => i < this.rating);
    }
}
