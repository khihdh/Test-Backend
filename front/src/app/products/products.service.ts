import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.class';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

    private apiUrl = 'http://localhost:3000';

    private static productslist: Product[] = null;
    private products$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);

    constructor(private http: HttpClient) { }

    getLastProductId(): number {
        if (ProductsService.productslist && ProductsService.productslist.length > 0) {
            // Get the ID of the last element in the productslist array
            return ProductsService.productslist[ProductsService.productslist.length - 1].id;
        } else {
            return 1; // Return 1 if productslist is empty
        }
    }

    getProducts(): Observable<Product[]> {
        if( ! ProductsService.productslist )
        {
            this.http.get<any>(`${this.apiUrl}/products`).subscribe(data => {
                ProductsService.productslist = data;
                
                this.products$.next(ProductsService.productslist);
            });
        }
        else
        {
            this.products$.next(ProductsService.productslist);
        }

        return this.products$;
    }

    create(prod: Product): Observable<Product[]> {
        const id = this.getLastProductId();
        prod.id=id+1;
        this.http.post<any>(`${this.apiUrl}/products`, prod).subscribe(data => {} );
        ProductsService.productslist.push(prod);
        this.products$.next(ProductsService.productslist);
        return this.products$;
    }

    update(prod: Product): Observable<Product[]>{
        const { id, ...productWithoutId } = prod;
        this.http.patch<any>(`${this.apiUrl}/products/${prod.id}`, productWithoutId).subscribe(data => {} );
        ProductsService.productslist.forEach(element => {
            if(element.id == prod.id)
            {
                element.name = prod.name;
                element.category = prod.category;
                element.code = prod.code;
                element.description = prod.description;
                element.image = prod.image;
                element.inventoryStatus = prod.inventoryStatus;
                element.price = prod.price;
                element.quantity = prod.quantity;
                element.rating = prod.rating;
            }
        });
        this.products$.next(ProductsService.productslist);

        return this.products$;
        return this.http.patch<Product[]>(`${this.apiUrl}/products/${prod.id}`, prod);
    }


    delete(id: number): Observable<Product[]>{
        this.http.delete(`${this.apiUrl}/products/${id}` ).subscribe(data => {} );
        ProductsService.productslist = ProductsService.productslist.filter(value => { return value.id !== id } );
        this.products$.next(ProductsService.productslist);
        return this.products$;
    }
}