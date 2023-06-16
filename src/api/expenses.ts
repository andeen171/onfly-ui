import { api } from 'src/boot/axios';

type ExpenseData = {
  id: number;
  description: string;
  date: string;
  value: number;
  user_id: number;
};

type ExpenseRequest = {
  description: string;
  date: string;
  value: number;
};

type MetaData = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export type ExpensePaginatedResponse = {
  data: ExpenseData[];
  meta: MetaData;
};

type ExpenseReponse = {
  data: ExpenseData;
};

export async function getExpenses(
  page = 1,
  rowsPerPage = 10
): Promise<ExpensePaginatedResponse> {
  try {
    const response = await api.get(
      `/expenses?page=${page}&limit=${rowsPerPage}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    );

    return response.data as ExpensePaginatedResponse;
  } catch (error) {
    throw error;
  }
}

export async function getExpense(id: number): Promise<ExpenseReponse> {
  try {
    const response = await api.get(`/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });

    return response.data as ExpenseReponse;
  } catch (error) {
    throw error;
  }
}

export async function createExpense(
  expense: ExpenseRequest
): Promise<ExpenseReponse> {
  try {
    const response = await api.post('/expenses', expense, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });

    return response.data as ExpenseReponse;
  } catch (error) {
    throw error;
  }
}

export async function updateExpense(expense: ExpenseData): Promise<void> {
  try {
    await api.put(`/expenses/${expense.id}`, expense, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteExpense(id: number): Promise<void> {
  try {
    await api.delete(`/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
      },
    });
  } catch (error) {
    throw error;
  }
}
