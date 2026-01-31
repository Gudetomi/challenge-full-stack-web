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
          v-model="searchQuery"
          label="Buscar aluno..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          @input="handleSearch"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Tabela de alunos -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <!-- Data Table do Vuetify -->
          <v-data-table
            :headers="headers"
            :items="students"
            :loading="loadingTable"
            :items-per-page="10"
            class="students-table"
          >
            <!-- Coluna Email com link -->
            <template #item.email="{ item }">
              <a :href="`mailto:${item.email}`" class="text-primary">
                {{ item.email }}
              </a>
            </template>

            <!-- Coluna de Ações (editar/deletar) -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-2">
                <!-- Botão Editar -->
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="warning"
                  @click="openEditDialog(item)"
                ></v-btn>

                <!-- Botão Deletar -->
                <v-btn
                  icon="mdi-trash-can"
                  size="small"
                  variant="text"
                  color="error"
                  @click="openDeleteDialog(item)"
                ></v-btn>
              </div>
            </template>

            <!-- Mensagem de carregamento -->
            <template #loading>
              <v-progress-linear
                indeterminate
                color="primary"
              ></v-progress-linear>
            </template>
          </v-data-table>

          <!-- Mensagem de erro -->
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="ma-4"
            closable
            @click:close="errorMessage = ''"
          >
            {{ errorMessage }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- DIALOG PARA CRIAR/EDITAR ALUNO -->
    <v-dialog v-model="dialogOpen" width="500px">
      <v-card>
        <!-- Título do dialog -->
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
              placeholder="000.000.000-00"
              required
            ></v-text-field>

            <!-- Mensagem de erro do submit -->
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

        <!-- Botões de ação -->
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

    <!-- DIALOG PARA CONFIRMAR DELETAR -->
    <v-dialog v-model="deleteDialogOpen" width="400px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Excluir Aluno?
        </v-card-title>

        <v-card-text class="py-6">
          <!-- Mensagem de confirmação -->
          <p class="mb-4">
            Tem certeza que deseja excluir <strong>{{ studentToDelete?.name }}</strong>?
          </p>
          
          <!-- Aviso -->
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
import { computed, onMounted, reactive, ref } from 'vue'

/**
 * INTERFACES/TIPOS
 */
interface Student {
  id: string
  name: string
  email: string
  ra: string
  cpf: string
  createdAt: string
  updatedAt: string
}

/**
 * ESTADO DA TABELA
 */
const students = ref<Student[]>([])
const loadingTable = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')

/**
 * ESTADO DO DIALOG
 */
const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const loadingSubmit = ref(false)
const submitError = ref('')

/**
 * DADOS DO FORMULÁRIO
 */
const form = reactive({
  name: '',
  email: '',
  ra: '',
  cpf: '',
})

const formErrors = reactive<{
  name?: string
  email?: string
  ra?: string
  cpf?: string
}>({})

/**
 * ESTADO DE EDIÇÃO
 */
const editingStudent = ref<Student | null>(null)
const studentToDelete = ref<Student | null>(null)

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

/**
 * COMPUTED PROPERTIES
 */
const isFormValid = computed(() => {
  return (
    form.name &&
    form.email &&
    form.ra &&
    form.cpf &&
    !formErrors.name &&
    !formErrors.email &&
    !formErrors.ra &&
    !formErrors.cpf
  )
})

/**
 * MÉTODOS DE VALIDAÇÃO
 */
function validateName() {
  if (!form.name) {
    formErrors.name = 'Nome é obrigatório'
  } else if (form.name.length < 3) {
    formErrors.name = 'Nome deve ter pelo menos 3 caracteres'
  } else {
    formErrors.name = ''
  }
}

function validateEmail() {
  if (!form.email) {
    formErrors.email = 'Email é obrigatório'
  } else if (!form.email.includes('@')) {
    formErrors.email = 'Email inválido'
  } else {
    formErrors.email = ''
  }
}

function validateRA() {
  if (!form.ra) {
    formErrors.ra = 'RA é obrigatório'
  } else if (form.ra.length < 3) {
    formErrors.ra = 'RA deve ter pelo menos 3 caracteres'
  } else {
    formErrors.ra = ''
  }
}

function validateCPF() {
  if (!form.cpf) {
    formErrors.cpf = 'CPF é obrigatório'
  } else if (form.cpf.length < 11) {
    formErrors.cpf = 'CPF inválido'
  } else {
    formErrors.cpf = ''
  }
}

/**
 * MÉTODOS DE DIALOG
 */
function openCreateDialog() {
  editingStudent.value = null
  form.name = ''
  form.email = ''
  form.ra = ''
  form.cpf = ''
  submitError.value = ''
  dialogOpen.value = true
}

function openEditDialog(student: Student) {
  editingStudent.value = student
  form.name = student.name
  form.email = student.email
  form.ra = student.ra
  form.cpf = student.cpf
  submitError.value = ''
  dialogOpen.value = true
}

function closeDialog() {
  dialogOpen.value = false
  editingStudent.value = null
}

function openDeleteDialog(student: Student) {
  studentToDelete.value = student
  deleteDialogOpen.value = true
}

/**
 * MÉTODOS DE SUBMIT
 */
async function handleSubmit() {
  // Valida campos
  validateName()
  validateEmail()
  validateRA()
  validateCPF()

  if (!isFormValid.value) return

  loadingSubmit.value = true
  submitError.value = ''

  try {
    // TODO: Chamar API para criar/editar aluno
    console.log('Salvando aluno:', form)
    
    // Simula delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Adiciona/atualiza na lista local
    if (editingStudent.value) {
      const index = students.value.findIndex(s => s.id === editingStudent.value!.id)
      if (index !== -1) {
        students.value[index] = {
          ...students.value[index],
          ...form,
        }
      }
    } else {
      students.value.push({
        id: Math.random().toString(),
        ...form,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }

    closeDialog()
  } catch (error: any) {
    submitError.value = error.message || 'Erro ao salvar aluno'
  } finally {
    loadingSubmit.value = false
  }
}

async function handleDelete() {
  if (!studentToDelete.value) return

  loadingSubmit.value = true

  try {
    // TODO: Chamar API para deletar
    console.log('Deletando aluno:', studentToDelete.value)
    
    // Simula delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Remove da lista
    students.value = students.value.filter(
      s => s.id !== studentToDelete.value!.id
    )

    deleteDialogOpen.value = false
  } catch (error) {
    errorMessage.value = 'Erro ao deletar aluno'
  } finally {
    loadingSubmit.value = false
  }
}

/**
 * BUSCA
 */
function handleSearch() {
  // TODO: Fazer requisição à API com search
  console.log('Buscando por:', searchQuery.value)
}

/**
 * CARREGAMENTO INICIAL
 */
onMounted(async () => {
  // TODO: Carregar lista de alunos da API
  loadingTable.value = true
  
  try {
    // Simula carregamento
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Dados simulados
    students.value = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@example.com',
        ra: '2024001',
        cpf: '12345678901',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@example.com',
        ra: '2024002',
        cpf: '98765432100',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  } finally {
    loadingTable.value = false
  }
})
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

/* Links */
:deep(a) {
  text-decoration: none;
  transition: all 0.2s ease;
}

:deep(a:hover) {
  text-decoration: underline;
}

/* Gap helper */
.gap-2 {
  gap: 8px;
}
</style>