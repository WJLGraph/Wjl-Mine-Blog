<script setup>
defineProps({
  icon: { type: String, required: true }
})
</script>

<template>
  <svg v-if="icon === 'fire'" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(158,203,255,0.9)" stroke-width="1.2">
    <path d="M12 2c1 4-4 5-4 10a4 4 0 0 0 8 0c0-2-1-3.5-2-5-1.5 2-3 2.5-3 2.5C12.5 7 13.5 4.5 12 2z" />
    <path d="M4 18h16M6 21h12" />
  </svg>
  <svg v-else-if="icon === 'shield'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(200,150,255,0.9)" stroke-width="1.2">
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
  <svg v-else-if="icon === 'map'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(80,230,200,0.9)" stroke-width="1.2">
    <circle cx="12" cy="12" r="9" />
    <path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
  </svg>
  <svg v-else-if="icon === 'trend'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(140,190,255,0.9)" stroke-width="1.2">
    <path d="M3 17l4-6 4 3 4-8 4 5" />
    <path d="M3 21h18" />
  </svg>
  <svg v-else-if="icon === 'graph'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(160,140,255,0.9)" stroke-width="1.2">
    <circle cx="7" cy="7" r="3" />
    <circle cx="17" cy="7" r="3" />
    <circle cx="12" cy="17" r="3" />
    <path d="M9 9.5l1.5 4M15 9.5l-1.5 4M9.8 6.8h4.4" />
  </svg>
  <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,200,110,0.9)" stroke-width="1.2">
    <path d="M5 8h14l-1.5 12h-11L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
</template>
