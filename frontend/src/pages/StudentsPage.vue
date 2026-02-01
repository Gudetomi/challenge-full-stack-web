<template>
  <!-- Container -->
  <v-container class="py-8">
    <!-- Cabeçalho com título e botão -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between">
          <!-- Título -->
          <h1 class="text-h4 font-weight-bold">Gerenciar Alunos</h1>

          <!-- Botão para criar novo aluno -->
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="openCreateDialog"
            size="large"
            class="text-none"
            :disabled="studentStore.loading"
          >
            Novo Aluno
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Barra de busca -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-text-field
          label="Buscar aluno..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          @input="handleSearch"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Mensagem de erro global -->
    <v-row v-if="studentStore.hasError" class="mb-6">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          closable
          @click:close="studentStore.clearError"
        >
          {{ studentStore.errorMessage }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Tabela de alunos -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <!-- Loading -->
          <v-progress-linear
            v-if="studentStore.isLoading"
            indeterminate
            color="primary"
          ></v-progress-linear>

          <!-- Data Table -->
          <v-data-table
            :headers="headers"
            :items="studentStore.students"
            :loading="studentStore.isLoading"
            :items-per-page="studentStore.pageSize"
            class="students-table"
          >
            <!-- Coluna Email com link -->
            <template #item.email="{ item }">
              <a :href="`mailto:${item.email}`" class="text-primary">
                {{ item.email }}
              </a>
            </template>

            <!-- Coluna de Ações -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-2">
                <!-- Botão Editar -->
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="warning"
                  @click="openEditDialog(item)"
                  title="Editar aluno"
                ></v-btn>

                <!-- Botão Deletar -->
                <v-btn
                  icon="mdi-trash-can"
                  size="small"
                  variant="text"
                  color="error"
                  @click="openDeleteDialog(item)"
                  title="Deletar aluno"
                ></v-btn>
              </div>
            </template>
          </v-data-table>

          <!-- Paginação -->
          <v-pagination
            v-model="studentStore.currentPage"
            :length="studentStore.totalPages"
            @update:model-value="handlePageChange"
            class="pa-4"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOG CRIAR/EDITAR ALUNO -->
    <v-dialog v-model="dialogOpen" width="500px">
      <v-card>
        <!-- Título -->
        <v-card-title class="text-h6 font-weight-bold">
          {{ editingStudent ? 'Editar Aluno' : 'Novo Aluno' }}
        </v-card-title>

        <v-divider></v-divider>

        <!-- Formulário -->
        <v-card-text class="py-6">
          <v-form @submit.prevent="handleSubmit">
            <!-- Campo Nome -->
            <v-text-field
              v-model="form.name"
              label="Nome"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              :error="!!formErrors.name"
              :error-messages="formErrors.name ? [formErrors.name] : []"
              @blur="validateName"
              required
            ></v-text-field>

            <!-- Campo Email -->
            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              :error="!!formErrors.email"
              :error-messages="formErrors.email ? [formErrors.email] : []"
              @blur="validateEmail"
              required
            ></v-text-field>

            <!-- Campo RA -->
            <v-text-field
              v-model="form.ra"
              label="RA (Número de Matrícula)"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              :error="!!formErrors.ra"
              :error-messages="formErrors.ra ? [formErrors.ra] : []"
              @blur="validateRA"
              required
            ></v-text-field>

            <!-- Campo CPF -->
            <v-text-field
              v-model="form.cpf"
              label="CPF"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              :error="!!formErrors.cpf"
              :error-messages="formErrors.cpf ? [formErrors.cpf] : []"
              @blur="validateCPF"
              placeholder="00000000000"
              required
            ></v-text-field>

            <!-- Erro de submit -->
            <v-alert
              v-if="submitError"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="submitError = ''"
            >
              {{ submitError }}
            </v-alert>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Botões -->
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>

          <v-btn
            variant="tonal"
            @click="closeDialog"
            :disabled="loadingSubmit"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="primary"
            @click="handleSubmit"
            :loading="loadingSubmit"
            :disabled="!isFormValid"
          >
            {{ editingStudent ? 'Atualizar' : 'Criar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- DIALOG CONFIRMAR DELETAR -->
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

        <!-- Botões -->
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>

          <v-btn
            variant="tonal"
            @click="deleteDialogOpen = false"
            :disabled="loadingSubmit"
          >
            Cancelar
          </v-btn>

          <v-btn
            color="error"
            @click="handleDelete"
            :loading="loadingSubmit"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useStudents } from '@/composables/useStudents';

/**
 * USE COMPOSABLE
 */
const {
  studentStore,
  dialogOpen,
  deleteDialogOpen,
  editingStudent,
  studentToDelete,
  loadingSubmit,
  submitError,
  form,
  formErrors,
  isFormValid,
  validateName,
  validateEmail,
  validateRA,
  validateCPF,
  openCreateDialog,
  openEditDialog,
  closeDialog,
  openDeleteDialog,
  handleSubmit,
  handleDelete,
  handleSearch,
  handlePageChange,
} = useStudents()

/**
 * DEFINIÇÃO DE COLUNAS DA TABELA
 */
const headers = [
  { title: 'Nome', key: 'name', width: '25%' },
  { title: 'Email', key: 'email', width: '30%' },
  { title: 'RA', key: 'ra', width: '15%' },
  { title: 'CPF', key: 'cpf', width: '15%' },
  { title: 'Ações', key: 'actions', align: 'center', width: '15%', sortable: false },
]
</script>

<style scoped>
/* Tabela de alunos */
.students-table {
  border-radius: 8px;
}

/* Remove fundo da tabela */
:deep(.v-data-table) {
  background: transparent;
}

/* Linha da tabela com hover */
:deep(.v-data-table__tr) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

:deep(.v-data-table__tr:hover) {
  background-color: rgba(0, 0, 0, 0.02);
}
:deep(a) {
  text-decoration: none;
  transition: all 0.2s ease;
}

:deep(a:hover) {
  text-decoration: underline;
}

.gap-2 {
  gap: 8px;
}
</style>