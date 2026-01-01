
import { ChatSession, StudentQuery } from '../types';

const CHAT_STORAGE_KEY = 'eduassist_chats';
const QUERY_STORAGE_KEY = 'eduassist_queries';

export const storageService = {
  saveChatSession: (session: ChatSession) => {
    const sessions = storageService.getChatSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    if (index > -1) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
  },

  getChatSessions: (): ChatSession[] => {
    const data = localStorage.getItem(CHAT_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  deleteChatSession: (id: string) => {
    const sessions = storageService.getChatSessions().filter(s => s.id !== id);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
  },

  saveQuery: (query: StudentQuery) => {
    const queries = storageService.getQueries();
    queries.unshift(query);
    localStorage.setItem(QUERY_STORAGE_KEY, JSON.stringify(queries));
  },

  getQueries: (): StudentQuery[] => {
    const data = localStorage.getItem(QUERY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
};
