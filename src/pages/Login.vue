<template>
  <div class="fullscreen text-center q-pa-md flex flex-center">
    <div>
      <q-card class="my-card" style="width: 400px">
        <q-card-section>
          <div class="text-h6">Login</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              filled
              v-model="form.username"
              :label="$t('Username')"
              @keydown.space.prevent
              lazy-rules="ondemand"
              :rules="[ val => val && val.length > 0 || $t('Please type username')]"
            >
              <template v-slot:append>
                <q-icon name="person" color="orange"/>
              </template>
            </q-input>

            <q-input
              filled
              type="password"
              v-model.trim="form.password"
              :label="$t('Password')"
              lazy-rules="ondemand"
              :rules="[ val => val && val.length > 0 || $t('Please type password')]"
              @keydown.space.prevent
            >
              <template v-slot:append>
                <q-icon name="key" color="orange"/>
              </template>
            </q-input>
            <div>
              <q-btn :label="$t('Sign-in')" type="submit" color="primary"/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: 'admin@teste.com',
        password: 'password'
      },
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  methods: {
    async onSubmit () {
      this.loading = true
      try {
        await this.$store.dispatch('user/login', this.form)
        await this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
      } catch (e) {
        console.log(e)
        alert('Credenciais Inválidas.')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
