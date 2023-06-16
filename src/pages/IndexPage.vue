<template>
  <q-page class="m-auto">
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
        <table-component v-if="paginatedData && !loading" :paginatedData="paginatedData" :fetchData="fetchData" />
        <table-skeleton v-else />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { getExpenses, createExpense, ExpensePaginatedResponse } from 'src/api/expenses';
import { notifySucess, notifyError } from 'src/utils/notify';
import TableComponent from 'src/components/TableComponent.vue';
import TableSkeleton from 'src/components/TableSkeleton.vue';


const paginatedData = ref<ExpensePaginatedResponse | null>(null);
const loading = ref<boolean>(false);

const $q = useQuasar()

const fetchData = async (page = 1, limit = 10) => {
  loading.value = true
  await getExpenses(page, limit)
    .then((res) => {
      paginatedData.value = res
      loading.value = false
    })
    .catch((err) => {
      notifyError($q, 'Error fetching expenses')
      console.log(err);
    });
}

const handleAdd = async () => {
  const newExpense = {
    description: 'Describe your expense',
    date: new Date().toISOString().split('T')[0],
    value: 1
  };

  await createExpense(newExpense)
    .then(expense => {
      fetchData(paginatedData.value?.meta.current_page, paginatedData.value?.meta.per_page)
      notifySucess($q, 'Expense added successfully')
      console.log('Expense added successfully:', expense);
    })
    .catch(error => {
      notifyError($q, 'Error adding expense')
      console.error('Error adding expense:', error);
    });
};

fetchData()
</script>
