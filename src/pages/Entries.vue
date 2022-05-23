<template>
  <q-page class="q-gutter-md" padding>
    <div>
      <div class="row q-col-gutter-lg">
        <div class="col-6">
          <FinancialStatement
            title="Balanço Real"
            :expense="financialData.real.totalExpense"
            :income="financialData.real.totalIncome"
            :balance="financialData.real.balance"/>
        </div>
        <div class="col-6">
          <FinancialStatement
            title="Previsão de Balanço"
            :expense="financialData.forecast.totalExpense"
            :income="financialData.forecast.totalIncome"
            :balance="financialData.forecast.balance"/>
        </div>
      </div>
    </div>
    <div class="column">
      <q-table
        class="table-default"
        :rows="rows"
        :columns="columns"
        row-key="index"
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        dense
      >
        <template v-slot:top>
          <div class="col-2 q-table__title">{{ $t('Entries') }}</div>
          <q-space/>
          <q-select dense outlined v-model="month" :options="months" emit-value map-options
                    style="width: 200px">
            <template v-slot:prepend>
              <q-icon name="event"/>
            </template>
          </q-select>
        </template>

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
        <template v-slot:body-cell-paymentType="props">
          <q-td :props="props">
            <q-icon size="xs" v-if="paymentTypes.CREDIT_CARD === props.value" name="credit_card" color="orange">
              <q-tooltip>
                {{ $t('Credit Card') }}
              </q-tooltip>
            </q-icon>
            <q-icon size="xs" v-else name="account_balance_wallet" color="primary">
              <q-tooltip>
                {{ $t('Default') }}
              </q-tooltip>
            </q-icon>
          </q-td>
        </template>
        <template v-slot:body-cell-description="props">
          <q-td :props="props">
            <div>
              <strong>{{ props.value }}</strong>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-value="props">
          <q-td :props="props">
            <div :class="props.row.isExpense ? 'text-negative' : 'text-positive'">
              {{ props.value }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div>
              <q-badge :color="props.row.isPaid ? 'positive' : 'negative'">{{ props.value }}</q-badge>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-_actions="props">
          <q-td :props="props">
            <div v-if="props.row.isPaid">
              <q-btn v-if="props.row.paymentType !== this.paymentTypes.CREDIT_CARD" flat round color="negative"
                     icon="highlight_off" dense @click="confirm(() => cancelPayment(props.row.id))">
                <q-tooltip>
                  {{ $t('Cancel') }} {{ $t('Payment') }}
                </q-tooltip>
              </q-btn>
              <template v-else>--</template>
            </div>
            <div v-else>
              <q-btn flat round color="negative" icon="delete" dense @click="confirm(() => remove(props.row.id))">
                <q-tooltip>
                  {{ $t('Delete') }}
                </q-tooltip>
              </q-btn>
              <q-btn v-if="props.row.paymentType !== this.paymentTypes.CREDIT_CARD" flat round color="positive"
                     icon="check" dense @click="openModalPay(props.row.id)">
                <q-tooltip>
                  {{ $t('Pay') }}
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="modal">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('Add') }} {{ $t('Expense') }}</div>
        </q-card-section>

        <q-separator/>

        <q-card-section style="width: 400px">
          <q-form
            class="q-gutter-md"
          >
            <q-btn-toggle
              v-model="typeDate"
              toggle-color="primary"
              :options="typesDate"
            />
            <q-input v-if="typeDate === 'other'" v-model="form.date" filled type="date" :label="$t('Date')"/>
            <q-input
              filled
              v-model="form.value"
              :label="$t('Value')"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
            <q-input
              filled
              v-model="form.description"
              :label="$t('Description')"
              lazy-rules="ondemand"
              :rules="[ val => val && val.length > 0 || 'Adicione uma descrição']"
            />

            <q-select filled v-model="form.category_id" :options="categoriesExpense" :label="$t('Category')" emit-value
                      map-options/>

            <q-toggle
              :label="$t('Pay with credit card')"
              icon="credit_card"
              color="primary"
              keep-color
              v-model="form.is_credit_card"
            />
            <q-select v-if="form.is_credit_card" filled v-model="form.credit_card_id" :options="credit_cards"
                      :label="labelOptionsCreditCard" emit-value
                      map-options/>
          </q-form>

        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn flat :label="$t('Cancel')" color="primary" v-close-popup/>
          <q-btn flat :label="$t('Save')" color="primary" @click="save"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalIncome.show">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('Add') }} {{ $t('Income') }}</div>
        </q-card-section>

        <q-separator/>

        <q-card-section style="width: 400px">
          <q-form
            class="q-gutter-md"
          >
            <q-btn-toggle
              v-model="typeDate"
              toggle-color="primary"
              :options="typesDate"
            />
            <q-input v-if="typeDate === 'other'" v-model="form.date" filled type="date" :label="$t('Date')"/>
            <q-input
              filled
              v-model="form.value"
              :label="$t('Value')"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              input-class="text-right"
            />
            <q-input
              filled
              v-model="form.description"
              :label="$t('Description')"
              lazy-rules="ondemand"
              :rules="[ val => val && val.length > 0 || 'Adicione uma descrição']"
            />

            <q-select filled v-model="form.category_id" :options="categoriesIncome" :label="$t('Category')" emit-value
                      map-options/>
          </q-form>

        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn flat :label="$t('Cancel')" color="primary" v-close-popup/>
          <q-btn flat :label="$t('Save')" color="primary" @click="saveIncome"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalPay.show">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ $t('Pay') }} {{ $t('Entry') }}</div>
        </q-card-section>

        <q-separator/>

        <q-card-section style="width: 400px">
          <q-form
            class="q-gutter-md"
          >
            <q-select filled v-model="modalPay.form.account" :options="accounts" label="Pagar com" emit-value
                      map-options/>
            <q-input v-model="modalPay.form.date" filled type="date"/>
          </q-form>

        </q-card-section>

        <q-separator/>

        <q-card-actions align="right">
          <q-btn flat :label="$t('Cancel')" color="primary" v-close-popup/>
          <q-btn flat :label="$t('Pay')" color="positive" @click="pay"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab color="accent" col icon="add" direction="left">
        <q-fab-action color="positive" @click="openModalIncome" icon="trending_up"/>
        <q-fab-action color="negative" @click="openModal" icon="payment"/>
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { api } from 'boot/axios'
import { createDateByString, currentMonth, formatDate, formatedToday, yesterday } from 'src/util'
import { capitalize } from 'vue'
import { PAYMENT_TYPES } from 'src/util/constants'
import FinancialStatement from 'components/FinancialStatement'

const formDefault = {
  description: '',
  value: 0.00,
  category_id: null,
  date: formatedToday()
}

export default {
  name: 'Entries',
  components: {
    FinancialStatement
  },
  created () {
    this.doSearch()

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    this.months = months.map((e, index) => ({
      label: this.$t(e),
      value: index + 1
    }))

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

    api.get('/categories').then((response) => {
      const { data = {} } = response.data
      const mapper = (item) => {
        return {
          label: item.description,
          value: item.id
        }
      }
      this.categoriesExpense = data.filter(e => e.type === 'EXPENSE').map(mapper)
      this.categoriesIncome = data.filter(e => e.type === 'INCOME').map(mapper)
    })

    api.get('/credit-cards').then((response) => {
      const { data = {} } = response.data
      this.credit_cards = data.map((item) => {
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
      month: currentMonth(),
      months: [],
      accounts: [],
      credit_cards: [],
      pagination: {
        rowsPerPage: 10
      },
      typeDate: 'today',
      typesDate: [
        {
          label: this.$t('today'),
          value: 'today'
        },
        {
          label: this.$t('yesterday'),
          value: 'yesterday'
        },
        {
          label: this.$t('other'),
          value: 'other'
        }
      ],
      rows: [],
      columns: [
        {
          name: 'paymentType',
          field: 'paymentType',
          required: true,
          align: 'left'
        },
        {
          name: 'description',
          label: capitalize(this.$t('Description')),
          field: 'description',
          required: true,
          align: 'center'
        },
        {
          name: 'value',
          label: capitalize(this.$t('Value')),
          field: 'value',
          align: 'center',
          format: (val, row) => this.$n(val, 'currency', 'pt-BR')
        },
        {
          name: 'status',
          label: capitalize(this.$t('Status')),
          field: 'status',
          align: 'center',
          format: (val, row) => this.$t(val)
        },
        {
          name: 'date',
          label: capitalize(this.$t('Date')),
          field: 'date',
          align: 'center',
          format: (val, row) => this.$d(createDateByString(val))
        },
        {
          name: '_actions',
          label: capitalize(this.$t('Actions')),
          field: '_actions',
          align: 'center'
        }
      ],
      form: { ...formDefault },
      modal: false,
      categoriesExpense: [],
      categoriesIncome: [],
      modalPay: {
        show: false,
        form: {
          id: null,
          account: null,
          date: formatedToday()
        }
      },
      modalIncome: {
        show: false,
        loading: false
      },
      financialData: {
        forecast: {},
        real: {}
      }
    }
  },
  computed: {
    labelOptionsCreditCard () {
      const label = this.credit_cards.length > 0 ? 'Credit Card' : 'None registered'
      return this.$t(label)
    },
    paymentTypes () {
      return PAYMENT_TYPES
    }
  },
  watch: {
    month () {
      this.doSearch()
    },
    'form.is_credit_card' (newValue) {
      if (newValue) {
        const creditCard = this.credit_cards.length > 0 ? this.credit_cards[0].value : null
        this.form.credit_card_id = creditCard
      } else {
        this.form.credit_card_id = null
      }
    },
    typeDate (newValue) {
      switch (newValue) {
        case 'today':
          console.log('today', formatDate(yesterday()))
          this.form.date = formatedToday()
          break
        case 'yesterday':
          console.log('yesterday', formatDate(yesterday()))
          this.form.date = formatDate(yesterday())
          break
        default:
          this.form.date = formatedToday()
          break
      }
    }
  },
  methods: {
    doSearch () {
      api.get('/entries', {
        params: {
          month: this.month
        }
      }).then((response) => {
        const { data = {} } = response.data
        this.rows = data
      })

      api.get('/entries/financial-statement', {
        params: {
          month: this.month
        }
      }).then((response) => {
        const { data = {} } = response.data
        this.financialData = data
      })
    },
    openModal () {
      this.modal = true
      this.form = {
        ...formDefault,
        is_credit_card: false,
        credit_card_id: null
      }
      this.form.category_id = this.categoriesExpense[0].value
    },
    openModalIncome () {
      this.modalIncome.show = true
      this.form = { ...formDefault }
      this.form.category_id = this.categoriesIncome[0].value
    },
    async saveIncome () {
      this.modalIncome.loading = true
      try {
        await api.post('/incomes', {
          ...this.form
        })

        this.doSearch()

        this.$q.notify({
          type: 'positive',
          message: 'Adicionado com sucesso.'
        })
        this.modalIncome.show = false
      } catch ({ response }) {
        this.$q.notify({
          type: 'negative',
          message: response.data.message
        })
      } finally {
        this.modalIncome.loading = false
      }
    },
    async save () {
      try {
        await api.post('/expenses', {
          ...this.form
        })

        this.doSearch()

        this.$q.notify({
          type: 'positive',
          message: 'Adicionado com sucesso.'
        })
        this.modal = false
      } catch ({ response }) {
        this.$q.notify({
          type: 'negative',
          message: response.data.message
        })
      }
    },
    confirm (callback) {
      this.$q.dialog({
        title: this.$t('Confirm'),
        message: this.$t('Are you sure?'),
        cancel: true,
        persistent: true
      }).onOk(() => {
        callback()
      })
    },
    async remove (id) {
      try {
        await api.delete(`/entries/${id}`)
        this.doSearch()

        this.$q.notify({
          type: 'positive',
          message: 'Removido com sucesso.'
        })
      } catch (e) {
        console.log(e)
      }
    },
    openModalPay (id) {
      this.modalPay.id = id
      this.modalPay.show = true
    },
    async pay () {
      try {
        const {
          account,
          date
        } = this.modalPay.form
        await api.put(`/entries/${this.modalPay.id}/pay`, {
          account,
          date
        })
        this.doSearch()

        this.$q.notify({
          type: 'positive',
          message: this.$t('Pago com sucesso.')
        })
        this.modalPay.show = false
      } catch (e) {
        console.log({ ...e })
        const { data } = e.response
        this.$q.notify({
          type: 'negative',
          message: this.$t(data.message)
        })
      }
    },
    async cancelPayment (id) {
      try {
        await api.put(`/entries/${id}/cancel-payment`)
        this.doSearch()

        this.$q.notify({
          type: 'positive',
          message: this.$t('Cancelado com sucesso.')
        })
        this.modalPay.show = false
      } catch (e) {
        console.log({ ...e })
        const { data } = e.response
        this.$q.notify({
          type: 'negative',
          message: this.$t(data.message)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-default {
  max-height: 76vh;
}
</style>
