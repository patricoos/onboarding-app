import { FirestoreService } from '@/shared/services/firestore-service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    imports: [],
    template: ` <div class="grid grid-cols-12 gap-8">Hello</div> `
})
export class Dashboard implements OnInit {
    private firestoreService = inject(FirestoreService);
    users: any[] = [];

    ngOnInit() {
        this.firestoreService.getUsers().subscribe({
            next: (data) => {
                this.users = data;
                console.log(data);
                
            },
            error: (error) => console.error(error)
        });
    }
}
