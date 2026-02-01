<template>
  <v-form ref="formRef" v-model="isValid">
    <v-text-field
      v-model="localForm.name"
      label="Nome"
      variant="outlined"
      density="comfortable"
      :rules="[rules.required, rules.minLength]"
      class="mb-2"
    ></v-text-field>

    <v-text-field
      v-model="localForm.email"
      label="Email"
      variant="outlined"
      density="comfortable"
      :rules="[rules.required, rules.email]"
      class="mb-2"
    ></v-text-field>

    <v-text-field
      v-model="localForm.ra"
      label="RA (Número de Matrícula)"
      variant="outlined"
      density="comfortable"
      :rules="[rules.required]"
      class="mb-2"
    ></v-text-field>

    <v-text-field
      v-model="localForm.cpf"
      label="CPF"
      variant="outlined"
      density="comfortable"
      placeholder="Somente números"
      :rules="[rules.required, rules.cpf]"
      class="mb-2"
    ></v-text-field>
  </v-form>
</template>

<script setup lang="ts">
import { validateCPF, validateEmail } from '@/utils/validators';
import { reactive, ref, watch } from 'vue';

const props = defineProps<{
  initialData?: any;
}>();

const emit = defineEmits(['update:modelValue']);

const isValid = ref(false);
const localForm = reactive({
  name: '',
  email: '',
  ra: '',
  cpf: '',
});

const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
  minLength: (v: string) => (v && v.length >= 3) || 'Mínimo de 3 caracteres',
  email: (v: string) => validateEmail(v),
  cpf: (v: string) => validateCPF(v),
};

// Avisa o pai sempre que algo mudar
watch([localForm, isValid], () => {
  emit('update:modelValue', { 
    data: { ...localForm }, 
    isValid: isValid.value 
  });
}, { deep: true });

// Sincroniza quando o pai muda o initialData (Edição ou Novo)
watch(() => props.initialData, (newData) => {
  Object.assign(localForm, {
    name: newData?.name || '',
    email: newData?.email || '',
    ra: newData?.ra || '',
    cpf: newData?.cpf || '',
  });
}, { deep: true, immediate: true });
</script>