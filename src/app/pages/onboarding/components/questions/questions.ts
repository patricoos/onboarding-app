import { OnboardingTreeNodeModel, QuestionModel } from '@/shared/services/firestore-service';
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

    addQuestion() {
        this.selectedNode.data?.questions.push({
            id: crypto.randomUUID(),
            text: '',
            options: [],
            correctAnswer: ''
        });
    }

    removeOption(question: QuestionModel, index: number) {
        question.options.splice(index, 1);
    }

    removeQuestion(index: number) {
        this.selectedNode.data?.questions.splice(index, 1);
    }

    addOption(question: QuestionModel) {
      question.options.push('');
    }

    selectAnswer(question: QuestionModel, option: string) {
        question.selectedAnswer = option;
    }

    selectCorrectAnswer(question: QuestionModel, option: string) {
        question.correctAnswer = option;
    }

    isCorrect(question: QuestionModel): boolean {
        return question.selectedAnswer === question.correctAnswer;
    }
}
