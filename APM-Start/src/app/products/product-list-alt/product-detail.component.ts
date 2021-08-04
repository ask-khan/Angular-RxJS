import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, EMPTY, Subject } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { Product } from '../product';

import { ProductService } from '../product.service';

@Component({
	selector: 'pm-product-detail',
	templateUrl: './product-detail.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
	errorMessage = '';
	private errorMessageSubject = new Subject<String>();
	errorMessage$ = this.errorMessageSubject.asObservable();
	constructor(private productService: ProductService) { }

	

	product$ = this.productService.selectedProduct$
		.pipe(
			catchError(err => {
				this.errorMessage = err;
				return EMPTY;
			})
		);

	productSuppliers$ = this.productService.selectedProductSupplier$
		.pipe(
			catchError(err => {
				this.errorMessageSubject.next(err)
				return EMPTY;
			})
		)

	pageTitle$ = this.product$ 
		.pipe( 
			map((p:Product ) => 
			p ? `Product Detail for: ${p.productName}`: null)
		)

	vm$ = combineLatest([ 
		this.product$, 
		this.productSuppliers$, 
		this.pageTitle$ 
	]).pipe(
		filter(([product]) => Boolean(product)),
		map(([product, productSuppliers, pageTitle]) => 

			({ product, productSuppliers, pageTitle })
		)
	)

}
