
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface StudentQuery {
  id: string;
  studentId: string;
  subject: string;
  description: string;
  status: 'pending' | 'resolved' | 'escalated';
  createdAt: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}
