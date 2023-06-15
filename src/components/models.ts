export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Expense {
  id: number;
  description: string;
  date: string;
  value: number;
  user_id: number;
}
