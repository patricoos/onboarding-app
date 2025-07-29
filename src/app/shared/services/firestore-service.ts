// firestore.service.ts
import { inject, Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
    private firestore = inject(Firestore);
    private menuCol: CollectionReference<DocumentData> = collection(this.firestore, 'onboarding');

    getUsers(): Observable<any[]> {
        const usersRef: CollectionReference<DocumentData> = collection(this.firestore, 'users');
        return collectionData(usersRef, { idField: 'id' });
    }

    getOnboardingTree(): Observable<OnboardingTreeNodeModel[]> {
        return collectionData(this.menuCol, { idField: 'id' }) as Observable<OnboardingTreeNodeModel[]>;
    }

    addOnboardingNode(label: string, parentId: string | null = null): Promise<void> {
        const newNode: OnboardingTreeNodeModel = {
            label,
            expanded: true,
            id: crypto.randomUUID(),
            children: [],
            parentId,
            data : {
                text: label
            }
        };
        return addDoc(this.menuCol, newNode).then(() => {});
    }

    updateOnboardingNode(node: OnboardingTreeNodeModel): Promise<void> {
        node.children = [];
        delete node.parent;
        console.log(node);

        return setDoc(doc(this.firestore, 'onboarding', node.id), node);
    }

    deleteOnboardingNode(node: OnboardingTreeNodeModel): Promise<void> {
        return deleteDoc(doc(this.firestore, 'onboarding', node.id));
    }
}

export interface OnboardingTreeNodeModel extends TreeNode<OnboardingModel> {
    id: string;
    parentId?: string | null;
}

export interface OnboardingModel {
    text: string;
}
