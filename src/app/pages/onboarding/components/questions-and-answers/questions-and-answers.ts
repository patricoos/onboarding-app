import { OnboardingTreeNodeModel, OptionModel, QuestionAndAnwserModel } from '@/shared/services/firestore-service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';
import { AccordionModule } from 'primeng/accordion';

@Component({
    selector: 'app-questions-and-answers',
    imports: [FormsModule, InputTextModule, ButtonModule, RadioButtonModule, DividerModule, CommonModule, EditorModule, AccordionModule ],
    templateUrl: './questions-and-answers.html',
})
export class QuestionsAndAnswers {
    @Input({ required: true }) selectedNode!: OnboardingTreeNodeModel;
    @Input({ required: true }) editMode: boolean = true;
    @Output() save: EventEmitter<void> = new EventEmitter();

    updateNode() {
        this.save.emit();
    }

    addQuestion() {
        this.selectedNode.data?.qa.push({
            id: crypto.randomUUID(),
            text: '',
            value: '',
            index:this.selectedNode.data?.qa.length
        });
        this.updateNode();
    }

    removeQuestion(index: number) {
        this.selectedNode.data?.qa.splice(index, 1);
        this.updateNode();
    }


    trackByIndex(index: number, _: any): number {
        return index;
    }
}
