// firestore.service.ts
import { inject, Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { TreeNode } from 'primeng/api';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
    private firestore = inject(Firestore);
    private menuCol: CollectionReference<OnboardingTreeNodeModel>;

    constructor() {
        this.menuCol = collection(this.firestore, 'onboarding') as CollectionReference<OnboardingTreeNodeModel>;
    }

    getUsers(): Observable<any[]> {
        const usersRef: CollectionReference<DocumentData> = collection(this.firestore, 'users');
        return collectionData(usersRef, { idField: 'id' });
    }

    getOnboardingTree(): Observable<OnboardingTreeNodeModel[]> {
        return collectionData<OnboardingTreeNodeModel>(this.menuCol, { idField: 'id' }).pipe(map((nodes) => nodes.sort((a, b) => (a.data?.index ?? 0) - (b.data?.index ?? 0))));
    }

    addOnboardingNode(label: string, index: number, parentId: string | null = null): Promise<void> {
        const newNode: OnboardingTreeNodeModel = {
            label,
            expanded: true,
            id: crypto.randomUUID(),
            children: [],
            parentId,
            data: {
                text: '',
                index: index,
                videos: [],
                questions: [],
                qa: [],
                files: []
            }
        };
        return addDoc(this.menuCol, newNode).then(() => {});
    }

    updateOnboardingNode(node: OnboardingTreeNodeModel): Promise<void> {
        node.children = [];
        delete node.parent;

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
    index: number;
    files: OnboardingFileModel[];
    videos: any[];
    questions: QuestionModel[];
    qa: QuestionAndAnwserModel[];
}

export interface OnboardingFileModel {
    id: string;
    index: number;
    name: string;
    url: string;
}

export interface QuestionModel {
    id: string;
    index: number;
    text: string;
    options: OptionModel[];
    correctAnswerId: string;
    selectedAnswerId?: string;
}

export interface OptionModel {
    id: string;
    index: number;
    value: string;
}

export interface QuestionAndAnwserModel {
    id: string;
    index: number;
    text: string;
    value: string;
}
