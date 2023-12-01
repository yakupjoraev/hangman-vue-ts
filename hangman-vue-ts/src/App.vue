<script setup lang="ts">
import GameHeader from './components/GameHeader.vue'
import GameFigure from './components/GameFigure.vue'
import GameWrongLetters from './components/GameWrongLetters.vue'
import GameWord from './components/GameWord.vue'
import GamePopup from './components/GamePopup.vue'
import GameNotification from './components/GameNotification.vue'
import { computed, ref, watch } from 'vue'
import { useRandomWord } from './composables/useRandomWord'

const { word, getRandomWord } = useRandomWord()

const letters = ref<string[]>([])
const correctLetters = computed(() => letters.value.filter((letter) => word.value.includes(letter)))
const wrongLetters = computed(() => letters.value.filter((letter) => !word.value.includes(letter)))
const isStatusLose = computed(() => wrongLetters.value.length === 6)
const isStatusWin = computed(() => [...word.value].every((x) => correctLetters.value.includes(x)))
const notification = ref<InstanceType<typeof GameNotification> | null>(null)
const popup = ref<InstanceType<typeof GamePopup> | null>(null)

watch(wrongLetters, () => {
  if (isStatusLose.value) {
    popup.value?.open('lose')
  }
})

watch(correctLetters, () => {
  if (isStatusWin.value) {
    popup.value?.open('win')
  }
  // if (correctLetters.value.length === word.value.length) {
  //   popup.value?.open('win')
  // }
})

window.addEventListener('keydown', ({ key }) => {
  if (isStatusLose.value || isStatusWin.value) {
    return
  }

  if (letters.value.includes(key)) {
    notification.value?.open()
    setTimeout(() => {
      notification.value?.close()
    }, 2000)
    return
  }
  if (/[а-яА-ЯёЁ]/.test(key)) {
    letters.value.push(key.toLowerCase())
  }
})

const restart = async () => {
  await getRandomWord()
  letters.value = []
  popup.value?.close()
}
</script>

<template>
  <GameHeader />
  <div class="game-container">
    <GameFigure :wrong-letters-count="wrongLetters.length" />
    <GameWrongLetters :wrong-letters="wrongLetters" />
    <GameWord :word="word" :correct-letters="correctLetters" />
  </div>

  <!-- Container for final message -->
  <GamePopup ref="popup" :word="word" @restart="restart" />
  <!-- Notification -->
  <GameNotification ref="notification" />
</template>