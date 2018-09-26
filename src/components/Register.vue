<template>
    <v-layout row>
        <v-flex xs12 sm4 offset-sm4 mt-5>
            <v-card>
                <v-flex pa-5>
                    <v-form>
                        <v-text-field
                                v-model="data.name"
                                label="Full name"
                                required
                        ></v-text-field>
                        <v-text-field
                                v-model="data.email"
                                label="Email address"
                                required
                        ></v-text-field>
                        <v-text-field
                                v-model="data.password"
                                label="Password"
                                required
                        ></v-text-field>
                        <v-btn block color="cyan" @click="register" :loading="processing">Register</v-btn>
                    </v-form>
                </v-flex>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      data: {
        name: "",
        email: "",
        password: ""
      },
      processing: false
    };
  },
  methods: {
    async register() {
      this.processing = true;
      try {
        const { name, email, password } = this.data;
        const res = await this.$http({
          method: "POST",
          url: "/api/v1/auth/register",
          data: { name, email, password }
        });
        this.processing = false;
        // eslint-disable-next-line no-console
        console.dir(res);
      } catch (err) {
        this.processing = false;
        // eslint-disable-next-line no-console
        console.dir(err.response.data.message);
      }
    }
  }
};
</script>

<style scoped>
</style>
