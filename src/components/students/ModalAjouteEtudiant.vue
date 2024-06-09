<script lang="ts" setup>
import { ProgramId, Student } from "@/@core/types";
import type { VForm } from 'vuetify/components/VForm';

import "vue3-pdf-app/dist/icons/main.css";

interface Props{
  isDialogVisible:boolean
}



interface Emit {
  (e:'update:isDialogVisible',value:boolean):void
  (e:'addEtudiant',value:Student):void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const form = ref<VForm>()
const errors = ref<Record<string, string | undefined>>({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  code: undefined,
})
const updateModelValue = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const createEtudiant = reactive<Student>({
  firstName: '',
  lastName: '',
  email: '',
  code: '',
  programId: ProgramId.ISI
})

const etudiantPrograms = ref([ProgramId.GI,ProgramId.ISI,ProgramId.MF,ProgramId.IIR]);


const onSubmit = ()=>{
  form.value?.validate()
    .then(({ valid: isValid }) => {
     if(isValid){
      emit("addEtudiant",createEtudiant)
      form.value?.reset()
      updateModelValue(false)
    }
  })
      // console.log(file.value[0]);
      // form.append('studentCode',props.code);
      // form.append('amount',amount.value);
      // form.append('paymentType',type.value);
      // form.append('date',date.value);
      // form.append('file',file.value[0]);
      // emit('addEtudiant',createEtudiant)
      // updateModelValue(false)
}

</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    @update:model-value="updateModelValue"   
     max-width="600"
     persistent
  >   
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <!-- Dialog Content -->
    <VCard title="Etudiant Formulaire :" subtitle="Remplir tous les champs pour ajouter un étudiant...">
      <VForm ref="form" @submit.prevent="onSubmit">
      <VCardText>
        <VRow>
            <VCol
            cols="12"
          >
            <AppTextField
              v-model="createEtudiant.code"
              label="Code"
              placeholder="Entrer le code de l'Etudiant(e)"
              :rules="[requiredValidator]"
                  :error-messages="errors.code"
            />
          </VCol>
          
          <VCol
            cols="12"
          >
            <AppTextField
              v-model="createEtudiant.lastName"
              label="Nom"
              placeholder="Entrer le Nom  du l'Etudiant(e)"
              :rules="[requiredValidator]"
              :error-messages="errors.lastName"

            />
          </VCol>
          <VCol
            cols="12"
          >
            <AppTextField
              v-model="createEtudiant.firstName"
              label="Prénom"
              placeholder="Entrer le Prénom  du l'Etudiant(e)"
              :rules="[requiredValidator]"
              :error-messages="errors.firstName"
            />
          </VCol>
         
          <VCol cols="12">
                <AppTextField
                  v-model="createEtudiant.email"
                  label="Email"
                  placeholder="Email de l'Etudiant(e) "
                  persistent-hint
                  hint="Exemple : ouss@io.com"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                />
              </VCol>
          <VCol
            cols="12"
          >
              <AppAutocomplete
              v-model="createEtudiant.programId"
              :items="etudiantPrograms"
              chips
              label="Program "
              placeholder="Choisir un Programe"
              :rules="[requiredValidator]"
            />
          
          </VCol>
        </VRow>
      </VCardText>
   
      <VCardText class="d-flex justify-end flex-wrap gap-3">
         <VBtn color="success" type="submit">
          Ajouter 
        </VBtn>
       
        <VBtn color="warning" @click="form?.reset()">
          Reset Form
        </VBtn>
         <VBtn
          variant="outlined"
          color="error"
          @click="updateModelValue(false)"
        >
          Annuler
        </VBtn>
       
      </VCardText>
       </VForm>
    </VCard>
  </VDialog>
</template>
