import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Observable, EMPTY, Subscription, combineLatest, BehaviorSubject, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductCategoryService } from 'src/app/product-categories/product-category.service';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<String>();
  errorMessage$ = this.errorMessageSubject.asObservable();


  //products: Product[] = [];
  sub: Subscription;

  //products: Product[] = [];
  products$ = this.productService.productWithCategory$
  .pipe( 
    catchError( err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  selectedProduct$ = this.productService.selectedProduct$;
  constructor(private productService: ProductService,
      private productCategoryService: ProductCategoryService
    ) { }

  ngOnInit(): void {
    //this.sub = this.productService.product$;
    // .subscribe(
    //   products => this.products = products,
    //   error => this.errorMessage = error
    // );
  }

  ngOnDestroy(): void {
    //this.sub.unsubscribe();
  }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged( productId );
    console.log('Not yet implemented');
  }
}
