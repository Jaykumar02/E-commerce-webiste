import { Component, OnInit } from '@angular/core';
import { DeliveryAgentService } from 'src/app/services/delivery-agent/deliveryAgentService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-deliveryagents',
  templateUrl: './admin-deliveryagents.component.html',
  styleUrls: ['./admin-deliveryagents.component.css']
})
export class AdminDeliveryagentsComponent implements OnInit {
  deliveryAgents: any[] = [];
  filteredAgents: any[] = [];
  selectedAgent: any | null = null;

  // Search property
  searchTerm: string = '';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;  
  totalItems: number = 0;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  // Reactive form for adding/editing agents
  agentForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],  // Required for editing
    lastName: ['', [Validators.required]],   // Required for editing
    email: ['', [Validators.required, Validators.email]],  // Required for editing
    password: ['', [Validators.minLength(6)]], // Optional for editing (if updated)
    deliveryZone: ['', [Validators.required]],  // Required for editing
    contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],  // Required for editing
    vehicleType: ['', [Validators.required]],  // Required for editing
    vehicleNumber: ['', [Validators.required, Validators.pattern('^[A-Z0-9 ]+$')]]  // Required for editing
  });

  // Add getters for form controls to simplify template code
  get f() {
    return this.agentForm.controls;
  }

  // Function to get error message for each field
  getErrorMessage(fieldName: string): string {
    const control = this.agentForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }

      if (control.errors['pattern']) {
        if (fieldName === 'contactNumber') {
          return 'Please enter a valid 10-digit contact number';
        }
        if (fieldName === 'vehicleNumber') {
          return 'Please enter a valid vehicle number (uppercase letters and numbers only)';
        }
      }
    }
    return '';
  }

  constructor(
    private deliveryAgentService: DeliveryAgentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchDeliveryAgents();
  }

  // Fetch the delivery agents
  fetchDeliveryAgents(): void {
    this.deliveryAgentService.getDeliveryAgents(0, 100).subscribe({
      next: (response) => {
        this.deliveryAgents = response.content;
        this.filteredAgents = [...this.deliveryAgents]; // Initialize filtered agents with all agents
        this.totalItems = this.filteredAgents.length;
        this.calculatePages();
      },
      error: (error) => {
        console.error('Error fetching delivery agents:', error);
      }
    });
  }

  // Search functionality with safe checks
  filterAgents(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredAgents = [...this.deliveryAgents];
    } else {
      const searchStr = this.searchTerm.toLowerCase().trim();
      this.filteredAgents = this.deliveryAgents.filter(agent => {
        const fullName = `${agent.firstname || ''} ${agent.lastname || ''}`.toLowerCase();
        const zone = (agent.deliveryZone || '').toLowerCase();
        const contact = (agent.contactNumber || '').toString().toLowerCase();

        return fullName.includes(searchStr) || zone.includes(searchStr) || contact.includes(searchStr);
      });
    }
    this.totalItems = this.filteredAgents.length;
    this.currentPage = 1; // Reset to the first page when searching
    this.calculatePages();
  }

  // Calculate total pages based on filtered agents
  calculatePages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Get current page items from filtered results
  get paginatedAgents(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAgents.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Change to the selected page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Go to the previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Go to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Reset the form for adding/updating agents
  resetForm(): void {
    this.agentForm.reset();
    this.selectedAgent = null;
  }

  // Populate the form with the agent data for editing
  populateModal(agent: any): void {
    this.selectedAgent = agent;
    this.agentForm.patchValue({
      firstName: agent.firstname,
      lastName: agent.lastname,
      email: agent.email,
      password: '',  // Keep password empty for edit (optional)
      deliveryZone: agent.deliveryZone, 
      contactNumber: agent.contactNumber,
      vehicleType: agent.vehicleType,
      vehicleNumber: agent.vehicleNumber
    });
  }
  

  addDeliveryAgent(): void {
    if (this.agentForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.agentForm.controls).forEach(key => {
        const control = this.agentForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    const formData = this.agentForm.value;
    const newAgent = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      password: formData.password,
      deliveryZone: formData.deliveryZone,
      contactNumber: formData.contactNumber,
      vehicleType: formData.vehicleType,
      vehicleNumber: formData.vehicleNumber
    };
  
    this.deliveryAgentService.addDeliveryAgent(newAgent).subscribe({
      next: (response) => {
        this.deliveryAgents.push(response);
        this.filterAgents();
        this.resetForm();
        alert('Agent added successfully!');
      },
      error: (error) => {
        console.error('Error adding delivery agent:', error);
        if (error.error?.message) {
          alert(error.error.message);
        } else {
          alert('Failed to add delivery agent. Please try again.');
        }
      }
    });
  }

  // Handle updating an existing delivery agent
  updateDeliveryAgent(): void {
    if (this.agentForm.invalid || !this.selectedAgent) return;
  
    // If password is not changed, set it to the current password
    const formData = this.agentForm.value;
    const updatedAgent = { 
      ...this.selectedAgent, 
      ...formData,
      password: formData.password || this.selectedAgent.password  // Retain the old password if not updated
    };
  
    this.deliveryAgentService.updateDeliveryAgent(updatedAgent).subscribe({
      next: (response) => {
        const index = this.deliveryAgents.findIndex(agent => agent.id === updatedAgent.id);
        if (index !== -1) {
          this.deliveryAgents[index] = response;
          this.filterAgents(); // Reapply search filter after updating
        }
        this.resetForm();
        alert('Agent updated successfully!');
        `$('#editAgentModal').modal('hide')`; // Close the modal after successful update
      },
      error: (error) => {
        console.error('Error updating delivery agent:', error);
        alert('Failed to update agent. Please try again.');
      }
    });
  }
  // Handle deleting a delivery agent
  deleteDeliveryAgent(agentId: number): void {
    this.deliveryAgentService.deleteDeliveryAgent(agentId).subscribe({
      next: () => {
        this.deliveryAgents = this.deliveryAgents.filter(agent => agent.id !== agentId);
        this.filterAgents(); // Reapply search filter after deleting
        alert('Agent deleted successfully!');
      },
      error: (error) => {
        console.error('Error deleting delivery agent:', error);
      }
    });
  }
}
