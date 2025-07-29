import { OnboardingTreeNodeModel, OptionModel, QuestionModel } from '@/shared/services/firestore-service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-questions',
    imports: [FormsModule, InputTextModule, ButtonModule, RadioButtonModule, DividerModule, CommonModule],
    templateUrl: './questions.html',
    styleUrl: './questions.scss'
})
export class Questions {
    @Input({ required: true }) selectedNode!: OnboardingTreeNodeModel;
    @Output() save: EventEmitter<void> = new EventEmitter();


    updateNode() {
        this.save.emit();
    }

    addQuestion() {
        this.selectedNode.data?.questions.push({
            id: crypto.randomUUID(),
            text: '',
            options: [],
            correctAnswerId: ''
        });
        this.updateNode();
    }

    removeOption(question: QuestionModel, index: number) {
        question.options.splice(index, 1);
        this.updateNode();
    }

    removeQuestion(index: number) {
        this.selectedNode.data?.questions.splice(index, 1);
        this.updateNode();
    }

    addOption(question: QuestionModel) {
        question.options.push({
            id: crypto.randomUUID(),
            value: ''
        });
        this.updateNode();
    }

    selectAnswer(question: QuestionModel, option: OptionModel) {
        question.selectedAnswerId = option.id;
    }

    selectCorrectAnswer(question: QuestionModel, option: OptionModel) {
        question.correctAnswerId = option.id;
        this.updateNode();
    }

    isCorrect(question: QuestionModel): boolean {
        return question.selectedAnswerId === question.correctAnswerId;
    }

    trackByIndex(index: number, _: any): number {
        return index;
    }
    trackByOptionId(index: number, option: OptionModel): string {
        return option.id;
    }
}
