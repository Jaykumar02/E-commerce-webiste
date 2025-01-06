import { Component, OnInit } from '@angular/core';
import { OrderservicesService } from 'src/app/services/admin/orderservices.service';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './order-dashboard.component.html',
  styleUrls: ['./order-dashboard.component.css'],
})
export class OrdersDashboardComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  paginatedOrders: any[] = [];
  searchQuery: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 5;  // Default items per page
  totalPages: number = 1;
  currentStatus: string = 'PLACED';
  allOrders: any[] = []; // Store all orders for the current status
  selectedOrder: any | null = null;  // Store selected order for modal
  isModalVisible: boolean = false;  // Control modal visibility

  deliveryAgents: any[] = [];  // Store delivery agents
  selectedDeliveryAgentId: number | null = null;  // Store selected delivery agent ID
  isAgentModalVisibleAssign: boolean = false;  // Control delivery agent modal visibility

  selectedCustomer: any | null = null; // Store selected customer details
  isCustomerModalVisible: boolean = false;  // Control customer details modal visibility
  isAgentModalVisible: boolean = false; // Control agent modal visibility

  constructor(private orderService: OrderservicesService) {}

  ngOnInit(): void {
    this.filterOrders('PLACED'); // Default to 'PLACED' orders
  }

  // Fetch all orders for current status
  filterOrders(status: string): void {
    this.currentStatus = status;
    this.currentPage = 1; // Reset to first page when changing status
    
    // Fetch all orders for the current status
    this.orderService.getOrdersByStatus(status, 0, 1000).subscribe(  // Use large number to get all orders
      (data: any[]) => {
        this.allOrders = data.map(order => ({
          ...order,
          productNames: order.orderItems
            .map((item: { productName: string }) => item.productName)
            .join(', '),
        }));
        this.applyFilters(); // Apply filters to all orders
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  // Apply search and date range filters
  applyFilters(): void {
    
   console.log(this.allOrders);
   
    
    this.filteredOrders = this.allOrders.filter((order) => {
      const matchesSearch =
        !this.searchQuery ||
        order.orderId.toString().includes(this.searchQuery) ||
        order.productNames.toLowerCase().includes(this.searchQuery.toLowerCase());

      const orderDate = new Date(order.orderDate);
      const matchesDateRange =
        (!this.startDate || orderDate >= new Date(this.startDate)) &&
        (!this.endDate || orderDate <= new Date(this.endDate));

      return matchesSearch && matchesDateRange;
    });

    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.updatePagination();
  }

  // Update pagination without making new API calls
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
      this.updatePagination();
    }
  }

  // Change page without making new API calls
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Update number of items per page
  changeItemsPerPage(): void {
    this.currentPage = 1;  // Reset to first page when changing items per page
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.updatePagination();
  }

  // View details of a specific order
  viewOrderDetails(order: any): void {
    this.selectedOrder = order;// Set the selected order to display in the modal
    this.isModalVisible = true;  // Show the modal
  }

  // View customer details for a specific order
  viewCustomerDetails(order: any): void {
    // Assuming customer details are in the 'customerDetails' field of each order
    this.selectedCustomer = order.customerDetails;
    this.isCustomerModalVisible = true;  // Show the customer details modal
  }

  // Load available delivery agents for the selected order
  loadDeliveryAgents(order: any): void {
    this.selectedOrder = order; // Store the selected order
   
    
    this.orderService.getDeliveryAgentsByOrderLocation(order.orderId).subscribe((agents: any[]) => {
      this.deliveryAgents = agents; // Store the available agents
      this.isAgentModalVisibleAssign = true; // Show the delivery agent modal
    });
  }

  // View delivery agent for the selected order
  viewDeliveryAgent(order: any): void {
    if (order.status === 'OUT_FOR_DELIVERY') {
      console.log(this.selectedOrder);
      
      
      
      if (order.deliveryAgent) {
        this.selectedDeliveryAgentId = order.deliveryAgent.id;
        console.log("Selected Delivery Agent ID (after assignment): ", this.selectedDeliveryAgentId); // Check the value after assignment
        this.isAgentModalVisible = true;
        console.log("hi")
      } else {
        alert('No delivery agent assigned to this order yet.');
      }
    } else {
      alert('This order is not out for delivery.');
    }
  }
  
  

  // Select a delivery agent and assign it to the order
  selectDeliveryAgent(agentId: number): void {
    this.selectedDeliveryAgentId = agentId;
    this.assignDeliveryAgentToOrder(agentId);
  }

  // Assign the selected delivery agent to the order
  // Assign the selected delivery agent to the order
assignDeliveryAgentToOrder(agent: any): void {
  if (this.selectedOrder) {
    // Assuming you want to assign the agent to the order here
    this.selectedOrder.deliveryAgent = agent; // Assign the selected agent to the order

    // Call the service to update the delivery agent for the order
    this.orderService.assignDeliveryAgentToOrder(this.selectedOrder.orderId, agent.id).subscribe(
      (response) => {
        alert(`Assigned Delivery Agent ${agent.firstname} ${agent.lastname} to Order ${this.selectedOrder.orderId}`);
        this.closeAgentModal();  // Close the delivery agent modal
        this.applyFilters();  // Refresh the orders list to reflect the change
      },
      (error) => {
        console.error('Error assigning delivery agent:', error);
        alert('Failed to assign delivery agent.');
      }
    );
  } else {
    alert('No order selected.');
  }

  
}






 

  // Close order details modal
  closeModal(): void {
    this.isModalVisible = false;  // Close the order details modal
  }

  // Close the delivery agent modal
  closeAgentModal(): void {
    this.isAgentModalVisibleAssign = false;  // Close the delivery agent modal
  }

   closeCustomerModal(): void {
    this.isCustomerModalVisible = false;
  }

  
}
