import { FirestoreService, OnboardingTreeNodeModel } from '@/shared/services/firestore-service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';

@Component({
    selector: 'app-onboarding',
    imports: [CommonModule, TreeModule, ContextMenuModule, DialogModule, ButtonModule, FormsModule, InputTextModule, EditorModule],
    templateUrl: './onboarding.html',
    styleUrl: './onboarding.scss'
})
export class Onboarding implements OnInit {
    private firestoreService = inject(FirestoreService);

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
                console.log(data);
            },
            error: (error) => console.error(error)
        });
    }

    showAddDialog() {
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
            await this.firestoreService.addOnboardingNode(label, parentId);
        }

        this.dialogVisible = false;
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
}
