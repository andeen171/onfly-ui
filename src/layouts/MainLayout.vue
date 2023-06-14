<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Expense's Management
        </q-toolbar-title>

        <q-btn @click="handleLogout" label="Logout" color="secondary" class="q-mr-md" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { api } from 'boot/axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  api.post('/logout', {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  })
    .then((res) => {
      localStorage.removeItem('userToken');
      console.log(res);
      router.push({ name: 'login' });
    })
    .catch((err) => {
      console.log(err);
    });
};
</script>
