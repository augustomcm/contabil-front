<template>
  <q-page padding>
    <q-table
      :title="$t('Credit Cards')"
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
            <q-btn v-if="allStatus.OPENED === props.row.currentInvoice.status" flat round color="primary" icon="fact_check" dense @click="closeInvoice(props.row.id)">
              <q-tooltip>
                {{ $t('Close Invoice')}}
              </q-tooltip>
            </q-btn>
            <q-btn v-else-if="allStatus.CLOSED === props.row.currentInvoice.status" flat round color="positive" icon="check" dense @click="openModalPayInvoice(props.row.id)">
              <q-tooltip>
                {{ $t('Pay Invoice')}}
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
          <div class="text-h6">{{ $t('Add') }} {{ $t('Credit Card') }}</div>
        </q-card-section>

        <q-separator/>
        <q-card-section style="width: 450px">
          <CreditCardForm ref="form" v-model="item" @submit="save"/>
        </q-card-section>
        <q-separator/>

        <q-card-actions align="right">
          <q-btn flat :label="$t('Cancel')" color="primary" v-close-popup/>
          <q-btn flat :label="$t('Save')" color="primary" @click="this.$refs.form.submit()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="modalPay.show">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('Pay') }} {{ $t('Invoice') }}</div>
        </q-card-section>

        <q-separator/>

        <q-card-section style="width: 400px">
          <q-form
            class="q-gutter-md"
          >
            <q-select filled v-model="modalPay.form.account" :options="accounts" label="Pagar com" emit-value
                      map-options/>
          </q-form>

        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn flat :label="$t('Cancel')" color="primary" v-close-popup/>
          <q-btn flat :label="$t('Pay')" color="positive" @click="payInvoice"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { api } from 'boot/axios'
import CreditCardForm from './components/Form'
import { INVOICE_STATUS } from 'src/util/constants'
import { createDateByString } from 'src/util'
const formDefault = {
  description: '',
  closing_day: 1,
  expiration_day: 10,
  limit: 0
}

export default {
  name: 'List',
  components: { CreditCardForm },
  created () {
    this.doSearch()
    api.get('/accounts').then((response) => {
      const { data = {} } = response.data
      this.accounts = data.map((item) => {
        return {
          label: item.description,
          value: item.id
        }
      })

      this.modalPay.form.account = this.accounts[0].value
    })
  },
  data () {
    return {
      accounts: [],
      allStatus: { ...INVOICE_STATUS },
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
          name: 'limit',
          label: this.$t('Limit'),
          field: 'limit',
          required: true,
          align: 'center',
          format: (val, row) => this.$n(val, 'currency', 'pt-BR')
        },
        {
          name: 'invoiceStatus',
          label: this.$t('Invoice Status'),
          field: 'currentInvoice',
          required: true,
          align: 'center',
          format: (val, row) => this.$t(val.status)
        },
        {
          name: 'invoiceAmount',
          label: this.$t('Invoice Amount'),
          field: 'currentInvoice',
          required: true,
          align: 'center',
          format: (val, row) => this.$n(val.total, 'currency', 'pt-BR')
        },
        {
          name: 'invoiceFinalDate',
          label: this.$t('Invoice Closes In'),
          field: 'currentInvoice',
          required: true,
          align: 'center',
          format: (val) => this.$d(createDateByString(val.finalDate))
        },
        {
          name: '_actions',
          label: this.$t('Actions'),
          field: '_actions',
          align: 'center'
        }
      ],
      item: {},
      idPay: null,
      modal: false,
      modalPay: {
        id: null,
        form: { account: null },
        show: false
      }
    }
  },
  methods: {
    doSearch () {
      api.get('/credit-cards').then((response) => {
        const { data = {} } = response.data
        this.rows = data
      })
    },
    openModal (item) {
      this.item = item ? { ...item } : { ...formDefault }
      console.log(this.item)
      this.item.limit = this.item.limit.toFixed(2)

      this.modal = true
    },
    closeModal () {
      this.modal = false
    },
    openModalPayInvoice (id) {
      this.modalPay.id = id
      this.modalPay.show = true
    },
    async save () {
      try {
        if (this.item.id) {
          await api.put(`/credit-cards/${this.item.id}`, { ...this.item })
        } else {
          await api.post('/credit-cards', { ...this.item })
        }
        this.doSearch()

        this.$q.notify({
          type: 'positive',
          message: 'Adicionado com sucesso.'
        })
        this.closeModal()
      } catch ({ response }) {
        this.$q.notify({
          type: 'negative',
          message: this.$t(response.data.message)
        })
      }
    },
    async closeInvoice (id) {
      try {
        await api.put(`/credit-cards/${id}/close-invoice`)

        this.doSearch()

        this.$q.notify({
          type: 'positive',
          message: this.$t('Closed with success.')
        })
        this.closeModal()
      } catch ({ response }) {
        this.$q.notify({
          type: 'negative',
          message: this.$t(response.data.message)
        })
      }
    },
    async payInvoice () {
      try {
        await api.put(`/credit-cards/${this.modalPay.id}/pay-invoice`, {
          ...this.modalPay.form
        })

        this.doSearch()

        this.$q.notify({
          type: 'positive',
          message: this.$t('Pay with success.')
        })
        this.closeModal()
      } catch ({ response }) {
        this.$q.notify({
          type: 'negative',
          message: this.$t(response.data.message)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
