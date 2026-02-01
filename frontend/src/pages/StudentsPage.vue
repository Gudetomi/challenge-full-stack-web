<template>
  <v-container class="py-8">
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <h1 class="text-h4 font-weight-bold">Gerenciar Alunos</h1>
          <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog" size="large" class="text-none"
            :disabled="studentStore.loading">
            Novo Aluno
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-text-field
    v-model="searchInput"
    label="Buscar aluno..."
    prepend-inner-icon="mdi-magnify"
    variant="outlined"
    density="comfortable"
    clearable
    @keyup.enter="handleSearch"
    @click:clear="resetTable"
    >
    <template #append-inner>
      <v-btn small color="primary" @click="handleSearch">
        Buscar
      </v-btn>
    </template>
    </v-text-field>
    <v-row v-if="studentStore.hasError" class="mb-6">
      <v-col cols="12">
        <v-alert type="error" variant="tonal" closable @click:close="studentStore.clearError">
          {{ studentStore.errorMessage }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-progress-linear v-if="studentStore.isLoading" indeterminate color="primary"></v-progress-linear>
          <v-data-table :headers="headers" :items="studentStore.students" :loading="studentStore.isLoading"
            :items-per-page="studentStore.pageSize" class="students-table">
            <template #item.email="{ item }">
              <a :href="`mailto:${item.email}`" class="text-primary">
                {{ item.email }}
              </a>
            </template>
          <template #item.actions="{ item }">
            <v-row class="justify-center" no-gutters>
              <v-btn icon color="warning" @click="openEditDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="error" @click="openDeleteDialog(item)">
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </v-row>
          </template>
          </v-data-table>
          <v-pagination v-model="studentStore.currentPage" :length="studentStore.totalPages"
            @update:model-value="handlePageChange" class="pa-4" />
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogOpen" width="500px">
      <v-card>
        <v-card-title>{{ editingStudent ? 'Editar Aluno' : 'Novo Aluno' }}</v-card-title>
        <v-card-text>
          <StudentForm 
            :initialData="editingStudent" 
            @update:modelValue="handleFormUpdate"
          />
          
          <v-alert v-if="submitError" type="error" class="mt-4">{{ submitError }}</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="handleSubmit" :loading="loadingSubmit" :disabled="!isFormValid">
            {{ editingStudent ? 'Atualizar' : 'Criar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialogOpen" width="400px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Excluir Aluno?
        </v-card-title>
        <v-card-text class="py-6">
          <p class="mb-4">
            Tem certeza que deseja excluir <strong>{{ studentToDelete?.name }}</strong>?
          </p>
          <p class="text-caption text-gray-600">
            Esta ação não pode ser desfeita.
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="tonal" @click="deleteDialogOpen = false" :disabled="loadingSubmit">
            Cancelar
          </v-btn>
          <v-btn color="error" @click="handleDelete" :loading="loadingSubmit">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import '@/assets/styles/StudentPage.scss';
import StudentForm from '@/components/StudentForm.vue';
import { useStudents } from '@/composables/useStudents';
const {
  studentStore,
  resetTable,
  searchInput,
  dialogOpen,
  deleteDialogOpen,
  editingStudent,
  studentToDelete,
  loadingSubmit,
  submitError,
  isFormValid,        
  handleFormUpdate,
  openCreateDialog,
  openEditDialog,
  closeDialog,
  openDeleteDialog,
  handleSubmit,
  handleDelete,
  handleSearch,
  handlePageChange,
} = useStudents()
const headers = [
  { title: 'Nome', key: 'name', width: '25%' },
  { title: 'Email', key: 'email', width: '30%' },
  { title: 'RA', key: 'ra', width: '15%' },
  { title: 'CPF', key: 'cpf', width: '15%' },
  { title: 'Ações', key: 'actions', align: 'center', width: '15%', sortable: false },
]
</script>
