<script setup>
import { ref, computed, watch } from 'vue';
import Header from './components/Header.vue';
import Button from './components/Button.vue';
import { calcularTotalPagar } from './helpers'

const cantidad = ref(10000)
const meses = ref(6)
const total = ref(0)
const MIN = 0
const MAX = 20000
const STEP = 100

const formatearDinero = (valor) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return formatter.format(valor)
}

watch([cantidad, meses], () => {
  total.value = calcularTotalPagar(cantidad.value, meses.value)
})

const pagoMensual = computed(() => {
  return total.value / meses.value
})

const handleChangeDecremento = () => {
  if (cantidad.value === MIN) return
  cantidad.value -= STEP
}

const handleChangeIncremento = () => {
  if (cantidad.value === MAX) return
  cantidad.value += STEP
}

</script>

<template>
  <main class="relative max-w-xl mx-auto my-8 sm:my-14 px-4">
    <!-- Glow ambiental de fondo -->
    <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

    <div class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100/90 p-6 sm:p-10 relative overflow-hidden transition-all duration-300">
      <!-- Barra superior de acento degradado -->
      <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>

      <Header />

      <!-- Tarjeta del Monto Seleccionado -->
      <section class="mt-8 bg-slate-50/80 border border-slate-200/70 rounded-2xl p-5 sm:p-6 text-center">
        <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Cantidad Solicitada</span>

        <div class="flex items-center justify-between gap-3 mt-3">
          <Button
            :operador="'-'"
            @fn="handleChangeDecremento"
          />

          <div class="flex-1 min-w-0">
            <p class="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 tabular-nums select-none">
              {{ formatearDinero(cantidad) }}
            </p>
            <span class="inline-block mt-1 text-xs font-semibold text-slate-400">Paso de {{ formatearDinero(STEP) }}</span>
          </div>

          <Button
            :operador="'+'"
            @fn="handleChangeIncremento"
          />
        </div>

        <!-- Slider de Rango estilizado -->
        <div class="mt-6 pt-2">
          <input 
            type="range" 
            class="w-full loan-slider h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none"
            :min="MIN"
            :max="MAX"
            :step="STEP"
            v-model.number="cantidad"
          >
          <div class="flex justify-between items-center text-xs font-semibold text-slate-400 mt-2 px-1">
            <span>Mín: {{ formatearDinero(MIN) }}</span>
            <span class="text-indigo-600/70 font-medium hidden sm:inline">Desliza para ajustar</span>
            <span>Máx: {{ formatearDinero(MAX) }}</span>
          </div>
        </div>
      </section>

      <!-- Selector de Plazo -->
      <section class="mt-8">
        <h2 class="text-center text-xl sm:text-2xl font-bold text-slate-800">
          Elige un <span class="text-indigo-600">plazo</span> a pagar
        </h2>

        <!-- Selector interactivo de botones / tarjetas rápidas sincronizadas con meses -->
        <div class="grid grid-cols-3 gap-2.5 sm:gap-3 mt-4">
          <button
            type="button"
            v-for="opcion in [6, 12, 24]"
            :key="opcion"
            @click="meses = opcion"
            :class="[
              'py-3 px-2 rounded-xl text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer border text-center flex flex-col items-center justify-center gap-0.5',
              meses === opcion
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-200'
                : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
            ]"
          >
            <span>{{ opcion }} meses</span>
            <span 
              :class="[
                'text-[10px] uppercase font-semibold tracking-wider',
                meses === opcion ? 'text-indigo-100' : 'text-slate-400'
              ]"
            >
              {{ opcion === 6 ? 'Bajo interés' : opcion === 12 ? 'Más elegido' : 'Cuota baja' }}
            </span>
          </button>
        </div>

        <!-- Select nativo con estilo premium (mantiene name="plazo" e id="plazo" para total compatibilidad) -->
        <div class="relative mt-3">
          <select 
            name="plazo"
            id="plazo"
            class="w-full py-3.5 px-4 bg-white border border-slate-200 rounded-xl appearance-none cursor-pointer text-center text-base font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-xs"
            v-model.number="meses"
          >
            <option value="6">6 meses</option>
            <option value="12">12 meses</option>
            <option value="24">24 meses</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      <!-- Resumen del Préstamo -->
      <section v-if="total > 0" class="mt-8 border-t border-slate-100 pt-6">
        <h2 class="text-center text-xl sm:text-2xl font-bold text-slate-800 mb-6">
          Resumen <span class="text-indigo-600">de Prestamo</span>
        </h2>

        <!-- Destacado de Mensualidad -->
        <div class="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white rounded-2xl p-6 shadow-lg shadow-indigo-600/25 relative overflow-hidden mb-4">
          <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div class="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p class="text-gray-200">
                <span class="text-indigo-100 text-xs font-bold uppercase tracking-wider block">Mensualidad: </span>
                <span class="text-3xl sm:text-4xl font-black tracking-tight mt-1 tabular-nums text-white block">
                  {{ formatearDinero(pagoMensual) }}
                </span>
              </p>
              <span class="text-indigo-200 text-xs mt-1 block">Cuota mensual fija por {{ meses }} meses</span>
            </div>
            <div class="inline-flex items-center gap-1.5 self-start sm:self-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
              <span>Cuota calculada</span>
            </div>
          </div>
        </div>

        <!-- Tarjetas de Plazo y Total a pagar -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
            <div>
              <p class="text-gray-500">
                <span class="text-gray-500 text-xs uppercase font-semibold tracking-wider block">Plazo: </span>
                <span class="text-slate-800 font-bold text-lg block mt-0.5">{{ meses }} meses</span>
              </p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
            <div>
              <p class="text-gray-500">
                <span class="text-gray-500 text-xs uppercase font-semibold tracking-wider block">Total a pagar: </span>
                <span class="text-indigo-600 font-extrabold text-lg tabular-nums block mt-0.5">{{ formatearDinero(total) }}</span>
              </p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Botón de acción adicional para experiencia realista -->
        <button 
          type="button" 
          class="w-full mt-5 py-4 px-6 bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Solicitar este préstamo</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </section>

      <!-- Estado inicial cuando total <= 0 -->
      <div v-else class="mt-8 border-t border-slate-100 pt-6">
        <div class="text-center p-6 bg-slate-50/80 border border-dashed border-slate-200 rounded-2xl">
          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-center text-gray-500 font-medium"> Añade cantidad y plazo para cotizar</p>
          <p class="text-slate-400 text-xs mt-1">Usa los botones o el deslizador para generar tu simulación en tiempo real.</p>
        </div>
      </div>
    </div>
  </main>
</template>
