<template>
  <q-card class="no-shadow" bordered>
    <q-card-section>
      <div class="text-h6 text-grey-8">
        Expenses
        <q-btn label="Add new expense" class="float-right text-capitalize text-indigo-8 shadow-3" icon="add"
          @click="handleAdd" />
      </div>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section class="q-pa-none">
      <q-table @request="onTableRequest" :rows="expenses" :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
        :columns="columns" v-model:pagination="pagination" class="no-shadow" row-key="name">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="Value" :props="props">
              <q-badge color="primary" class="cursor-pointer" @click="props.row.__edit = true">
                {{ props.row.value }}
              </q-badge>
              <q-popup-edit v-model="props.row.value" @hide="handleEdit(props.row)">
                <q-input v-model="props.row.value" autofocus counter type="number" step="0.01" />
              </q-popup-edit>
            </q-td>
            <q-td key="Date" :props="props">
              <q-badge color="primary" class="cursor-pointer" @click="props.row.__edit = true">
                {{ props.row.date }}
              </q-badge>
              <q-popup-edit v-model="props.row.date" @hide="handleEdit(props.row)">
                <q-date v-model="props.row.date" autofocus mask="YYYY-MM-DD" today-btn :options="dateOptions" />
              </q-popup-edit>
            </q-td>
            <q-td key="Description" :props="props">
              <q-badge color="primary" class="cursor-pointer" @click="props.row.__edit = true">
                {{ props.row.description }}
              </q-badge>
              <q-popup-edit class="display-none" v-model="props.row.description" @hide="handleEdit(props.row)">
                <q-input v-model="props.row.description" autofocus counter maxlength="191" />
              </q-popup-edit>
            </q-td>
            <q-td key="Actions" :props="props">
              <q-btn @click="handleDelete(props.row.id)" size="sm" name="delete" icon='delete' />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Expense } from './models';
import { api } from 'src/boot/axios';
import { useQuasar, QNotifyCreateOptions, QTableProps } from 'quasar'

const $q = useQuasar()

const columns = [
  { name: 'Value', label: 'Value', field: 'value' },
  { name: 'Date', label: 'Date', field: 'date' },
  { name: 'Description', label: 'Description', field: 'description' },
  { name: 'Actions', label: 'Actions', field: 'actions' },
];

const positiveNotification: QNotifyCreateOptions = {
  color: 'positive',
  position: 'bottom-left',
  message: '',
  icon: 'info'
}

const negativeNotification: QNotifyCreateOptions = {
  color: 'negative',
  position: 'bottom-left',
  message: '',
  icon: 'error'
}

const expenses = ref<Expense[]>([]);
const loading = ref<boolean>(false);
const initialPagination = {
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
}
const pagination = ref<QTableProps['pagination']>(initialPagination);

const today = new Date().toISOString().split('T')[0].replaceAll('-', '/');

const onTableRequest = (props: QTableProps) => {
  pagination.value = props.pagination
  loading.value = true
  getExpenses()
}

const getExpenses = async () => {
  const { page, rowsPerPage } = pagination.value ?? { page: 1, rowsPerPage: 10 }
  await api.get(`/expenses?page=${page}&limit=${rowsPerPage}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  })
    .then((res) => {
      expenses.value = res.data.data
      if (pagination.value) {
        pagination.value.rowsNumber = res.data.meta.total
      }
      loading.value = false
    })
    .catch((err) => {
      console.log(err);
    });
}

const handleAdd = () => {
  const newExpense = { description: 'Describe your expense', date: today, value: 1 };  // adjust this as needed

  api.post('/expenses', newExpense, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  })
    .then(response => {
      const createdExpense = response.data.data;
      expenses.value.unshift(createdExpense);
      console.log('Expense added successfully');
      $q.notify({
        ...positiveNotification,
        message: 'Expense added successfully',
      })
    })
    .catch(error => {
      console.error('Error adding expense:', error);
      $q.notify({
        ...negativeNotification,
        message: 'Error adding expense'
      })
    });
};


const handleEdit = (expense: Expense) => {
  api.put(`/expenses/${expense.id}`, expense, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  })
    .then(() => {
      console.log('Expense edited successfully');
      $q.notify({
        ...positiveNotification,
        message: 'Expense edited successfully'
      })
    })
    .catch((error) => {
      console.error('Error editing expense:', error);
      $q.notify({
        ...negativeNotification,
        message: 'Error editing expense'
      })
    });
};

const handleDelete = (expenseId: number) => {
  api.delete(`/expenses/${expenseId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  })
    .then(() => {
      const updatedExpenses = expenses.value.filter(expense => expense.id !== expenseId);
      expenses.value = updatedExpenses;
      console.log('Expense deleted successfully');
      $q.notify({
        ...positiveNotification,
        message: 'Expense deleted successfully'
      })
    })
    .catch((error) => {
      console.error('Error deleting expense:', error);
      $q.notify({
        ...negativeNotification,
        message: 'Error deleting expense'
      })
    });
};

const dateOptions = (date: string) => {
  return date <= today
}
getExpenses();
</script>
