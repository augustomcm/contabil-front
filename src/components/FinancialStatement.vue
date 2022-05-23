<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>
    <div class="row q-col-gutter-sm q-pa-md">
      <div class="col">
        <q-card class="bg-green-5 text-white">
          <q-card-section>
            <div class="text-h6 text-center text-weight-light">Total Receita</div>
          </q-card-section>
          <q-card-section class="q-pt-none text-center text-weight-bold text-h5">{{ $n(income.amount, 'currency') }}</q-card-section>
        </q-card>
      </div>
      <div class="col">
        <q-card class="bg-red-5 text-white">
          <q-card-section>
            <div class="text-h6 text-center text-weight-light">Total Despesa</div>
          </q-card-section>
          <q-card-section class="q-pt-none text-center text-weight-bold text-h5">{{ $n(expense.amount, 'currency') }}</q-card-section>
        </q-card>
      </div>
      <div class="col">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6 text-center text-weight-light">Balanço</div>
          </q-card-section>
          <q-card-section class="q-pt-none text-center text-weight-bold text-h5">
            <span :class="{'text-negative': balanceIsNegative}">{{ $n(balance.amount, 'currency') }}</span>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'FinancialStatement',
  props: {
    title: String,
    income: {
      type: Object,
      default: () => ({ currency: 'BRL', amount: 0.00 })
    },
    expense: {
      type: Object,
      default: () => ({ currency: 'BRL', amount: 0.00 })
    },
    balance: {
      type: Object,
      default: () => ({ currency: 'BRL', amount: 0.00 })
    }
  },
  computed: {
    balanceIsNegative () {
      return this.balance.amount < 0
    }
  }
}
</script>

<style scoped>

</style>
