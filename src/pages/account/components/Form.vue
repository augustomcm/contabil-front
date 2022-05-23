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
      :model-value="modelValue.balance"
      @update:model-value="(newValue) => updateValue('balance', newValue)"
      :label="$t('Balance')"
      mask="#.##"
      fill-mask="0"
      reverse-fill-mask
      input-class="text-right"
    />
  </q-form>
</template>

<script>
export default {
  name: 'AccountForm',
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
