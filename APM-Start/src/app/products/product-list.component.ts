import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { Product } from './product';
import { ProductService } from './product.service';
import { ProductCategoryService } from './../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  selectedCategoryId = 1;
  //categories;

  //private categorySelectedSubject = new Subject<number>();
  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  //products: Product[] = [];
  products$= combineLatest([ this.productService.productWithAdd$, this.categorySelectedAction$ 
  //  .pipe( startWith(0) ) 
  ])   
  .pipe( 
      map(( [products, selectedCategoryId]) =>
      products.filter( product => 
        selectedCategoryId ? product.categoryId === this.selectedCategoryId: true
      )
    ),
    catchError( err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  categories$ = this.productCategoryService.productCategories$
  .pipe(
    catchError( err => {
      this.errorMessage = err;
      return EMPTY;
    })
  )

  // productSimpleFilter$ =  this.productService.productWithCategory$  
  // .pipe( 
  //   map( products =>
  //     products.filter( product => {
  //       this.selectedCategoryId ? product.categoryId === this.selectedCategoryId: true
  //     })
  //   )
  // );

  sub: Subscription;

  constructor(private productService: ProductService,
      private productCategoryService:ProductCategoryService
    ) { }

  ngOnInit(): void {
    //this.products$ =  this.productService.getProducts();
    // this.sub = this.productService.getProducts()
    //   .subscribe(
    //     products => this.products = products,
    //     error => this.errorMessage = error
    //   );
  }

  ngOnDestroy(): void {
    //this.sub.unsubscribe();
  }

  onAdd(): void {
    console.log('Not yet implemented');
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next( + categoryId );
    // this.selectedCategoryId =+ categoryId;
    // console.log('Not yet implemented');
  }
}
