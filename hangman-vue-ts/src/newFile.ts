import { letters, notification } from './App.vue';

window.addEventListener('keydown', ({ key }) => {
if (letters.value.includes(key)) {
notification.value?.open();
setTimeout(() => {
notification.value?.close();
}, 2000);
return;
}
if (/[а-яА-ЯёЁ]/.test(key)) {
letters.value.push(key.toLowerCase());
}
});
