// firestore.service.ts
import { inject, Injectable } from '@angular/core';
import { CollectionReference, DocumentData, DocumentReference, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, getDoc, setDoc } from '@angular/fire/firestore';
import { TreeNode } from 'primeng/api';
import { catchError, from, map, Observable, of, shareReplay, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
    private firestore = inject(Firestore);
    private menuCol: CollectionReference<OnboardingTreeNodeModel>;
    private onboarder: CollectionReference<MyOnboardingTreeNodeModel>;

    constructor() {
        this.menuCol = collection(this.firestore, 'onboarding') as CollectionReference<OnboardingTreeNodeModel>;
        this.onboarder = collection(this.firestore, 'onboarded') as CollectionReference<MyOnboardingTreeNodeModel>;
    }

    getUsers(): Observable<any[]> {
        return collectionData<MyOnboardingTreeNodeModel>(this.onboarder, { idField: 'id' }).pipe(map((nodes) => nodes.sort((a, b) => (a.data?.index ?? 0) - (b.data?.index ?? 0))));
    }

    getOnboardingTree(): Observable<OnboardingTreeNodeModel[]> {
        return collectionData<OnboardingTreeNodeModel>(this.menuCol, { idField: 'id' }).pipe(map((nodes) => nodes.sort((a, b) => (a.data?.index ?? 0) - (b.data?.index ?? 0))));
    }

    updateMyOnboardingNode(userId: string, node: OnboardingTreeNodeModel): Promise<void> {
        return setDoc(doc(this.firestore, 'onboarded', userId), node);
    }

    getUserById(userId: string): Observable<MyOnboardingTreeNodeModel | null> {
        console.log(userId);
        const userDocRef = doc(this.firestore, `onboarded/${userId}`);

        return docData(userDocRef, { idField: 'id' }).pipe(
            catchError((error) => {
                console.error('Failed to fetch user:', error);
                return of(null); // or you can throwError if you want to propagate it
            })
        ) as Observable<MyOnboardingTreeNodeModel | null>;
    }

getUserByIdFromList(userId: string): Observable<MyOnboardingTreeNodeModel | undefined> {
  return collectionData<MyOnboardingTreeNodeModel>(this.onboarder, { idField: 'id' }).pipe(
    map((items) => items.find(item => item.id === userId)),
    shareReplay(1)
  );
}


    addMyOnboardingNode(id: string, nodes: OnboardingTreeNodeModel[]): Promise<DocumentReference<MyOnboardingTreeNodeModel, DocumentData>> {
        const newNode: MyOnboardingTreeNodeModel = {
            label: '',
            expanded: true,
            id: id,
            index: 0,
            children: nodes as any,
            data: {
                id: id,
                index: 0
            }
        };

        return addDoc(this.onboarder, newNode);
    }

    addOnboardingNode(label: string, index: number, parentId: string | null = null): Promise<void> {
        const newNode: OnboardingTreeNodeModel = {
            label,
            expanded: true,
            id: crypto.randomUUID(),
            children: [],
            parentId,
            index: index,
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

export interface MyOnboardingTreeNodeModel extends TreeNode<OnboardingTreeNodeModel> {
    id: string;
    index: number;
}

export interface OnboardingTreeNodeModel extends TreeNode<OnboardingModel> {
    id: string;
    index: number;
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
