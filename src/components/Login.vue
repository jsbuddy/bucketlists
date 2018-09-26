<template>
    <v-layout row>
        <v-flex xs12 sm4 offset-sm4 my-5>
            <v-card>
                <v-flex pa-5 mb-5>
                    <v-form>
                        <v-text-field
                                v-model="data.email"
                                label="Email address"
                                required
                                type="email"
                        ></v-text-field>
                        <v-text-field
                                v-model="data.password"
                                label="Password"
                                type="password"
                                required
                        ></v-text-field>
                        <v-btn block color="cyan" @click="login" :loading="processing">Login</v-btn>
                    </v-form>
                </v-flex>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
	export default {
		name: "Login",
		data() {
			return {
				data: {
					email: '',
					password: ''
				},
				processing: false
			}
		},
		methods: {
			async login() {
				this.processing = true;
				try {
					const { email, password } = this.data;
					const res = await this.$http({
						method: 'POST',
						url: '/api/v1/auth/login',
						data: { email, password }
					});
					localStorage.setItem('token', JSON.stringify(res.data.token));
					this.processing = false;
					this.$router.push({ path: '/buckets' });
				} catch (err) {
                    // eslint-disable-next-line no-console
					console.dir(err.response.data.message);
					this.processing = false;
				}
			}
		}
	}
</script>

<style scoped>

</style>