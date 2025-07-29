import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ScrollPanelModule
  ],
  templateUrl: './app-chat.html',
})
export class ChatComponent {
  messages: { sender: string; text: string }[] = [
    { sender: 'Bot', text: 'Hello! How can I help you today?' }
  ];
  userInput: string = '';

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ sender: 'You', text: this.userInput });
    const input = this.userInput;
    this.userInput = '';

    setTimeout(() => {
      this.messages.push({
        sender: 'Bot',
        text: `You said: "${input}"`
      });
    }, 800);
  }
}
