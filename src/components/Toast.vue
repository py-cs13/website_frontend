<template>
  <div 
    v-if="visible" 
    class="toast-container"
  >
    <div 
      class="toast" 
      :class="[`toast-${type}`]"
    >
      <div class="toast-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else>ℹ</span>
      </div>
      <div class="toast-message">{{ message }}</div>
      <button v-if="!autoClose" class="toast-close" @click="closeToast">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info'
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 3000
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const visible = ref(true)

const closeToast = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

onMounted(() => {
  if (props.autoClose) {
    setTimeout(() => {
      closeToast()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  min-width: 240px;
  max-width: 400px;
  opacity: 0;
  transform: scale(0.9);
  animation: toastFadeIn 0.3s ease forwards;
}

.toast-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  line-height: 1.5;
}

.toast-close {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.5);
}

.toast-success {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: white;
}

.toast-success .toast-icon {
  background: rgba(255, 255, 255, 0.2);
}

.toast-error {
  background: linear-gradient(135deg, #F44336 0%, #EF5350 100%);
  color: white;
}

.toast-error .toast-icon {
  background: rgba(255, 255, 255, 0.2);
}

.toast-warning {
  background: linear-gradient(135deg, #FF9800 0%, #FFA726 100%);
  color: white;
}

.toast-warning .toast-icon {
  background: rgba(255, 255, 255, 0.2);
}

.toast-info {
  background: linear-gradient(135deg, #FF6B9D 0%, #FF8FA3 100%);
  color: white;
}

.toast-info .toast-icon {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes toastFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>