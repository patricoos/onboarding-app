// firestore.service.ts
import { inject, Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
 private firestore = inject(Firestore);

  getUsers(): Observable<any[]> {
    const usersRef: CollectionReference<DocumentData> = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' });
  }
}
