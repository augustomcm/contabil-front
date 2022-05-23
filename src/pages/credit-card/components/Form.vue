<template>
  <q-form
    ref="form"
    class="q-gutter-md"
  >
    <q-input
      filled
      :model-value="modelValue.description"
      @update:model-value="(newValue) => updateValue('description', newValue)"
      :label="$t('Description')"
      lazy-rules="ondemand"
      :rules="[ val => val && val.length > 0 || $t('This field is required')]"
    />
    <q-input
      filled
      :model-value="modelValue.limit"
      @update:model-value="(newValue) => updateValue('limit', newValue)"
      :label="$t('Limit')"
      mask="#.##"
      fill-mask="0"
      reverse-fill-mask
      input-class="text-right"
    />
    <q-input
      filled
      min="1"
      max="31"
      type="number"
      :model-value="modelValue.closing_day"
      @update:model-value="(newValue) => updateValue('closing_day', newValue)"
      :label="$t('Closing Day')"
      :rules="[ val => val > 0 && val <= 31 || $t('This value is invalid')]"
    />
    <q-input
      filled
      min="1"
      max="31"
      type="number"
      :model-value="modelValue.expiration_day"
      @update:model-value="(newValue) => updateValue('expiration_day', newValue)"
      :label="$t('Expiration Day')"
      :rules="[ val => val > 0 && val <= 31 || $t('This value is invalid')]"
    />
  </q-form>
</template>

<script>
export default {
  name: 'CreditCardForm',
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  methods: {
    updateValue (key, value) {
      this.$emit('update:modelValue', {
        ...this.modelValue,
        [key]: value
      })
    },
    submit () {
      this.$refs.form.submit()
    }
  }
}
</script>

<style scoped>

</style>
