

<script setup>
defineProps({
    operador: {
        type: String,
        required: true
    }
})
defineEmits(['fn'])
</script>

<template>
    <button 
        type="button"
        class="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-white hover:bg-indigo-600 text-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 shadow-sm hover:shadow-md hover:shadow-indigo-500/20 text-2xl font-bold transition-all duration-200 active:scale-90 cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-indigo-100"
        :aria-label="operador === '+' ? 'Aumentar cantidad' : 'Disminuir cantidad'"
        @click="$emit('fn')"
    >
        {{ operador }}
    </button>
</template>