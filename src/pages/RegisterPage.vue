<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm ? { 'width': '80%' } : { 'width': '30%' }">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10 bg-grey">
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Register
              </div>
            </div>
          </q-card-section>
          <q-card-section align="center">
            <q-form class="q-gutter-md" @submit="handleSubmit">

              <q-input filled v-model="name" label="Name" lazy-rules />

              <q-input filled v-model="email" label="Email" lazy-rules />

              <q-input type="password" filled v-model="password" label="Password" lazy-rules />

              <q-input type="password" filled v-model="passwordConfirmation" label="Confirm Password" lazy-rules />

              <q-btn label="Register" type="submit" color="primary" />
            </q-form>
          </q-card-section>
          <q-card-actions align="center">
            <q-btn flat label="Already have an account? Log-in!" to="/login" />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { register } from 'src/api/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

const router = useRouter();
const $q = useQuasar();

const handleSubmit = () => {
  register({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value,
  })
    .then(() => {
      $q.notify({
        color: 'positive',
        position: 'top',
        message: 'Registered successfully! An email has been sent to you to verify your account.',
        icon: 'info',
      });
      setTimeout(() => {
        router.push({ name: 'home' });
      }, 500);
    }).catch((err) => {
      $q.notify({
        color: 'negative',
        position: 'top',
        message: 'Something went wrong',
        icon: 'error',
      });
      console.log(err);
    });
};
</script>
