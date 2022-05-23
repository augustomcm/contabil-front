<template>
  <div className="q-pa-md">
    <q-table
      style="height: 400px"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="index"
    />
  </div>
</template>

<script>
import { ref } from 'vue'

const columns = [
  {
    name: 'index',
    label: '#',
    field: 'index'
  },
  {
    name: 'name',
    // required: true,
    label: 'Dessert (100g serving)',
    align: 'left'
    // field: row => row.name,
    // format: val => `${val}`,
    // sortable: true
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories',
    field: 'calories'
  },
  {
    name: 'fat',
    label: 'Fat (g)',
    field: 'fat'
  },
  {
    name: 'carbs',
    label: 'Carbs (g)',
    field: 'carbs'
  },
  {
    name: 'protein',
    label: 'Protein (g)',
    field: 'protein'
  },
  {
    name: 'sodium',
    label: 'Sodium (mg)',
    field: 'sodium'
  },
  {
    name: 'calcium',
    label: 'Calcium (%)',
    field: 'calcium'
  },
  {
    name: 'iron',
    label: 'Iron (%)',
    field: 'iron'
  }
]

const seed = [
  {
    id: 1,
    description: 'Teste',
    amount: 'R$ 10,00',
    date: '2022-02-01'
  },
  {
    id: 2,
    description: 'Teste 2',
    amount: 'R$ 25,00',
    date: '2022-02-01'
  }
]

// we generate lots of rows here
let rows = []
for (let i = 0; i < 1000; i++) {
  rows = rows.concat(seed.slice(0).map(r => ({ ...r })))
}
rows.forEach((row, index) => {
  row.index = index
})

export default {
  setup () {
    return {
      columns,
      rows,

      pagination: ref({
        rowsPerPage: 0
      })
    }
  }
}
</script>
