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
import { AdminDeliveryagentsComponent } from './admin-deliveryagents/admin-deliveryagents.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';




@NgModule({
  declarations: [AdminDashboardComponent, AdminHomeComponent, AdminProductsComponent, AdminCategoryComponent, AdminDeliveryagentsComponent, ViewCustomerComponent, AdminFooterComponent],
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
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule // Add FormsModule for form validation
    
    
  ],
  exports: [AdminDashboardComponent,AdminHomeComponent]
})
export class AdminModule {}
