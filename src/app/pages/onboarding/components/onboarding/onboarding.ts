import { FirestoreService, OnboardingFileModel, OnboardingTreeNodeModel } from '@/shared/services/firestore-service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem, TreeDragDropService, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TreeModule, TreeNodeDropEvent } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { FirestorageService } from '@/shared/services/firestorage-service';
import { Questions } from '../questions/questions';
import { QuestionsAndAnswers } from '../questions-and-answers/questions-and-answers';

@Component({
    selector: 'app-onboarding',
    imports: [CommonModule, TreeModule, ContextMenuModule, DialogModule, ButtonModule, FormsModule, InputTextModule, EditorModule, TableModule, FileUploadModule, ButtonModule, InputTextModule, ToastModule, Questions, QuestionsAndAnswers],
    providers: [TreeDragDropService],
    templateUrl: './onboarding.html'
})
export class Onboarding implements OnInit {
    private firestoreService = inject(FirestoreService);
    private firestorageService = inject(FirestorageService);

    editMode = true;

    nodes: OnboardingTreeNodeModel[] = [];
    selectedNode!: OnboardingTreeNodeModel;
    contextMenuItems: MenuItem[] = [
        {
            label: 'Add',
            icon: 'pi pi-plus',
            command: () => this.showAddDialog()
        },
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => this.showEditDialog()
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => this.deleteNode()
        }
    ];

    dialogVisible = false;
    labelInput = '';
    editingNode: OnboardingTreeNodeModel | null = null;
    parentNode: OnboardingTreeNodeModel | null = null;

    ngOnInit() {
        this.firestoreService.getOnboardingTree().subscribe({
            next: (data) => {
                this.nodes = this.buildTree(data);
                if (!this.selectedNode && this.nodes.find((x) => x)) {
                    this.selectedNode = this.nodes.find((x) => x) as OnboardingTreeNodeModel;
                }
            },
            error: (error) => console.error(error)
        });
    }

    showAddDialog(setselectedNodeAsNull = false) {
        if (setselectedNodeAsNull) {
            this.selectedNode = null!;
        }
        this.labelInput = '';
        this.editingNode = null;
        this.dialogVisible = true;
    }

    showEditDialog() {
        this.labelInput = this.selectedNode.label as string;
        this.editingNode = this.selectedNode;
        this.dialogVisible = true;
    }

    async saveNode() {
        const label = this.labelInput.trim();
        if (!label) return;

        if (this.editingNode) {
            this.editingNode.label = label;
            await this.firestoreService.updateOnboardingNode(this.editingNode);
        } else {
            const parentId = this.selectedNode?.id ?? null;
            await this.firestoreService.addOnboardingNode(label, this.selectedNode?.data?.index ?? this.nodes.length, parentId);
        }

        this.dialogVisible = false;
    }

    async onNodeDrop(event: TreeNodeDropEvent) {
        (event.dragNode as OnboardingTreeNodeModel).data!.index = event.dropNode?.children ? event.dropNode?.children?.length! : event.index! ?? 0;
        (event.dragNode as OnboardingTreeNodeModel).parentId = (event.dropNode as OnboardingTreeNodeModel).id!;
        await this.firestoreService.updateOnboardingNode(event.dropNode as OnboardingTreeNodeModel);
        await this.firestoreService.updateOnboardingNode(event.dragNode as OnboardingTreeNodeModel);
    }

    async updateNode() {
        if (this.selectedNode) {
            await this.firestoreService.updateOnboardingNode(this.selectedNode);
        }
    }

    async deleteNode() {
        if (this.selectedNode?.id) {
            await this.firestoreService.deleteOnboardingNode(this.selectedNode);
        }
        this.selectedNode = null!;
    }

    buildTree(flatNodes: OnboardingTreeNodeModel[]): OnboardingTreeNodeModel[] {
        const lookup = new Map<string, OnboardingTreeNodeModel>();
        const roots: OnboardingTreeNodeModel[] = [];

        flatNodes.forEach((node) => {
            node.children = [];
            lookup.set(node.id!, node);
        });

        flatNodes.forEach((node) => {
            if (node.parentId) {
                const parent = lookup.get(node.parentId);
                if (parent) {
                    parent?.children?.push(node);
                } else {
                    roots.push(node);
                }
            } else {
                roots.push(node);
            }
        });

        return roots;
    }

    async upload(event: any, uploader: any) {
        const file: File = event.files[0];
        const fileId = crypto.randomUUID();
        const url = await this.firestorageService.uploadFile(fileId, file);
        this.selectedNode.data?.files.push({
            id: fileId,
            name: file.name,
            url: url,
            index: this.selectedNode.data?.files.length
        });
        uploader.clear();
        await this.updateNode();
    }

    async delete(file: OnboardingFileModel) {
        const filePath = `uploads/${file.id}-${file.name}`;
        await this.firestorageService.deleteFile(filePath);
        this.selectedNode.data!.files = this.selectedNode.data!.files.filter((f) => f.id !== file.id);
        await this.updateNode();
    }
}
