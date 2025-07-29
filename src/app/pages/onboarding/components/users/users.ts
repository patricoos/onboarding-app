import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-users',
  imports: [CommonModule, TableModule],
  templateUrl: './users.html',
})
export class Users {
 users = [
    { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com' },
    { firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com' },
    { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com' },
    { firstName: 'Diana', lastName: 'Evans', email: 'diana@example.com' },
    { firstName: 'Ethan', lastName: 'Williams', email: 'ethan@example.com' }
  ];
}
