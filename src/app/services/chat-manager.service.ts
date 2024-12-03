import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat, ChatList, DEFAULT_CHAT_NAME, OpenAIParameters, DEFAULT_OPENAI_PARAMETERS } from '../models/chat.model';
import { Message, DEFAULT_SYSTEM_MESSAGE } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatManagerService {
  private readonly STORAGE_KEY = 'chat_list';
  private chatList = new BehaviorSubject<ChatList>({ chats: {}, activeId: null });

  constructor() {
    this.loadChats();
    if (Object.keys(this.chatList.value.chats).length === 0) {
      this.createNewChat();
    }
  }

  private loadChats(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // Convert date strings back to Date objects
        Object.values(data.chats).forEach((chat: any) => {
          chat.createdAt = new Date(chat.createdAt);
          chat.updatedAt = new Date(chat.updatedAt);
          chat.messages.forEach((msg: any) => {
            msg.timestamp = new Date(msg.timestamp);
          });
          // Ensure openAIParameters exists for backward compatibility
          if (!chat.openAIParameters) {
            chat.openAIParameters = { ...DEFAULT_OPENAI_PARAMETERS };
          }
        });
        this.chatList.next(data);
      } catch (error) {
        console.error('Error loading chats:', error);
        this.chatList.next({ chats: {}, activeId: null });
      }
    }
  }

  private saveChats(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.chatList.value));
  }

  getChatList(): Observable<ChatList> {
    return this.chatList.asObservable();
  }

  getActiveChat(): Chat | null {
    const { chats, activeId } = this.chatList.value;
    return activeId ? chats[activeId] : null;
  }

  createNewChat(): string {
    const id = Date.now().toString();
    const systemMessage = DEFAULT_SYSTEM_MESSAGE;
    
    const newChat: Chat = {
      id,
      name: DEFAULT_CHAT_NAME,
      messages: [{
        id: Date.now().toString(),
        content: systemMessage,
        role: 'system',
        timestamp: new Date()
      }],
      systemMessage,
      createdAt: new Date(),
      updatedAt: new Date(),
      openAIParameters: { ...DEFAULT_OPENAI_PARAMETERS }
    };

    const updatedChats = {
      chats: { ...this.chatList.value.chats, [id]: newChat },
      activeId: id
    };

    this.chatList.next(updatedChats);
    this.saveChats();
    return id;
  }

  updateChatName(id: string, name: string): void {
    const { chats } = this.chatList.value;
    if (chats[id]) {
      const updatedChat = {
        ...chats[id],
        name: name.trim() || DEFAULT_CHAT_NAME,
        updatedAt: new Date()
      };

      const updatedChats = {
        ...this.chatList.value,
        chats: { ...chats, [id]: updatedChat }
      };

      this.chatList.next(updatedChats);
      this.saveChats();
    }
  }

  updateSystemMessage(id: string, systemMessage: string): void {
    const { chats } = this.chatList.value;
    if (chats[id]) {
      const messages = chats[id].messages;
      const systemMessageObj: Message = {
        id: Date.now().toString(),
        content: systemMessage,
        role: 'system',
        timestamp: new Date()
      };

      // Remove existing system message if any
      const updatedMessages = messages.filter(msg => msg.role !== 'system');
      updatedMessages.unshift(systemMessageObj);

      const updatedChat = {
        ...chats[id],
        messages: updatedMessages,
        systemMessage,
        updatedAt: new Date()
      };

      const updatedChats = {
        ...this.chatList.value,
        chats: { ...chats, [id]: updatedChat }
      };

      this.chatList.next(updatedChats);
      this.saveChats();
    }
  }

  updateOpenAIParameters(id: string, parameters: OpenAIParameters): void {
    const { chats } = this.chatList.value;
    if (chats[id]) {
      const updatedChat = {
        ...chats[id],
        openAIParameters: parameters,
        updatedAt: new Date()
      };

      const updatedChats = {
        ...this.chatList.value,
        chats: { ...chats, [id]: updatedChat }
      };

      this.chatList.next(updatedChats);
      this.saveChats();
    }
  }

  deleteChat(id: string): void {
    const { chats, activeId } = this.chatList.value;
    const { [id]: removed, ...remainingChats } = chats;
    
    let newActiveId = activeId;
    if (activeId === id) {
      const chatIds = Object.keys(remainingChats);
      newActiveId = chatIds.length > 0 ? chatIds[0] : null;
      if (!newActiveId) {
        newActiveId = this.createNewChat();
        return;
      }
    }

    this.chatList.next({
      chats: remainingChats,
      activeId: newActiveId
    });
    this.saveChats();
  }

  setActiveChat(id: string): void {
    if (this.chatList.value.chats[id]) {
      this.chatList.next({
        ...this.chatList.value,
        activeId: id
      });
      this.saveChats();
    }
  }

  updateChatMessages(id: string, messages: Message[]): void {
    const { chats } = this.chatList.value;
    if (chats[id]) {
      const systemMessage = messages.find(msg => msg.role === 'system')?.content || DEFAULT_SYSTEM_MESSAGE;
      
      const updatedChat = {
        ...chats[id],
        messages,
        systemMessage,
        updatedAt: new Date()
      };

      const updatedChats = {
        ...this.chatList.value,
        chats: { ...chats, [id]: updatedChat }
      };

      this.chatList.next(updatedChats);
      this.saveChats();
    }
  }
}