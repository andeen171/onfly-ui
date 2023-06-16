import { QVueGlobals } from 'quasar';

export const notifySucess = ($q: QVueGlobals, message: string) => {
  $q.notify({
    color: 'positive',
    position: 'bottom-left',
    message: message,
    icon: 'info',
  });
};

export const notifyError = ($q: QVueGlobals, message: string) => {
  $q.notify({
    color: 'negative',
    position: 'bottom-left',
    message: message,
    icon: 'error',
  });
};
