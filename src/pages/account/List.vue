<template>
  <q-page padding>
    <q-table
      :title="$t('Accounts')"
      :rows="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
      dense
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-italic text-purple"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell-description="props">
        <q-td :props="props">
          <div>
            <strong>{{ props.value }}</strong>
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-amount="props">
        <q-td :props="props">
          <div>
            <q-badge :color="props.row.isNegative ? 'red' : 'green'" :label="props.value"/>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-_actions="props">
        <q-td :props="props">
          <div>
            <q-btn flat round color="warning" icon="edit" dense @click="openModal(props.row)">
              <q-tooltip>
                {{ $t('Edit')}}
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" @click="openModal()"/>
    </q-page-sticky>
    <q-dialog v-model="modal">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('Add') }} {{ $t('Account') }}</div>
        </q-card-section>

        <q-separator/>
        <q-card-section style="width: 450px">
          <AccountForm ref="form" v-model="item" @submit="save"/>
        </q-card-section>
        <q-separator/>

        <q-card-actions align="right">
          <q-btn flat :label="$t('Cancel')" color="primary" v-close-popup/>
          <q-btn flat :label="$t('Save')" color="primary" @click="this.$refs.form.submit()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { api } from 'boot/axios'
import AccountForm from 'pages/account/components/Form'

const formDefault = {
  description: '',
  balance: 0
}

export default {
  name: 'AccountList',
  components: { AccountForm },
  created () {
    this.doSearch()
  },
  data () {
    return {
      pagination: {
        rowsPerPage: 15
      },
      rows: [],
      columns: [
        {
          name: 'description',
          label: this.$t('Description'),
          field: 'description',
          required: true,
          align: 'center'
        },
        {
          name: 'balance',
          label: this.$t('Balance'),
          field: 'balance',
          required: true,
          align: 'center',
          format: (val, row) => this.$n(val, 'currency', 'pt-BR')
        },
        {
          name: '_actions',
          label: this.$t('Actions'),
          field: '_actions',
          align: 'center'
        }
      ],
      item: {},
      modal: false
    }
  },
  methods: {
    doSearch () {
      api.get('/accounts').then((response) => {
        const { data = {} } = response.data
        this.rows = data
      })
    },
    openModal (item) {
      this.item = item ? { ...item } : { ...formDefault }
      this.item.balance = this.item.balance.toFixed(2)

      this.modal = true
    },
    closeModal () {
      this.modal = false
    },
    async save () {
      try {
        if (this.item.id) {
          await api.put(`/accounts/${this.item.id}`, { ...this.item })
        } else {
          await api.post('/accounts', { ...this.item })
        }

        this.doSearch()

        this.$q.notify({
          type: 'positive',
          message: 'Salvo com sucesso.'
        })
        this.closeModal()
      } catch ({ response }) {
        this.$q.notify({
          type: 'negative',
          message: response.data.message
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
