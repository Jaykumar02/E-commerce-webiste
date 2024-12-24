import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button'; // Add MatButtonModule
import { MatIconModule } from '@angular/material/icon'; // If you're using mat-icon
import { MatRippleModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { OrdersModule } from './orders/orders.module';
import { AppRoutingModule } from '../app-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';

@NgModule({
  declarations: [AdminDashboardComponent, AdminHomeComponent, AdminProductsComponent, AdminCategoryComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatRippleModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    OrdersModule,
    AppRoutingModule
  ],
  exports: [AdminDashboardComponent,AdminHomeComponent]
})
export class AdminModule {}