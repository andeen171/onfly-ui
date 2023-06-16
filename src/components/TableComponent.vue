<template>
  <q-table @request="onTableRequest" :rows="$props.paginatedData.data" :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
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
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
import { Expense } from './models';
import { QTableProps, useQuasar } from 'quasar'
import { notifySucess, notifyError } from 'src/utils/notify';
import { ExpensePaginatedResponse, updateExpense, deleteExpense } from 'src/api/expenses';

const props = defineProps({
  paginatedData: {
    type: Object as PropType<ExpensePaginatedResponse>,
    required: true,
  },
  fetchData: {
    type: Function as PropType<(page?: number, limit?: number) => Promise<void>>,
    required: true,
  }
})

const columns = [
  { name: 'Value', label: 'Value', field: 'value' },
  { name: 'Date', label: 'Date', field: 'date' },
  { name: 'Description', label: 'Description', field: 'description' },
  { name: 'Actions', label: 'Actions', field: 'actions' },
];

const $q = useQuasar()

const today = new Date().toISOString().split('T')[0].replaceAll('-', '/');
const pagination = ref<QTableProps['pagination']>({
  page: props.paginatedData.meta.current_page,
  rowsPerPage: props.paginatedData.meta.per_page,
  rowsNumber: props.paginatedData.meta.total,
});

const dateOptions = (date: string) => {
  return date <= today
}

const onTableRequest = (tableProps: QTableProps) => {
  // Check if the pagination props exist because their type is | undefined
  if (tableProps.pagination) {
    pagination.value = tableProps.pagination
    props.fetchData(tableProps.pagination.page, tableProps.pagination.rowsPerPage)
  }
}

const handleEdit = async (expense: Expense) => {
  await updateExpense(expense)
    .then(() => {
      props.fetchData(pagination.value?.page, pagination.value?.rowsPerPage)
      notifySucess($q, 'Expense edited successfully')
    })
    .catch((error) => {
      notifyError($q, 'Error editing expense')
      console.error('Error editing expense:', error);
    });
};

const handleDelete = async (expenseId: number) => {
  await deleteExpense(expenseId)
    .then(() => {
      props.fetchData(pagination.value?.page, pagination.value?.rowsPerPage)
      notifySucess($q, 'Expense deleted successfully')
    })
    .catch((error) => {
      notifyError($q, 'Error deleting expense')
      console.error('Error deleting expense:', error);
    });
};

</script>
