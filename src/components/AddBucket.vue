<template>
    <v-card>
        <v-card-title class="headline">New Bucket</v-card-title>
        <v-flex pa-3>
            <v-form>
                <v-text-field
                        label="Name"
                        required
                        type="text"
                        v-model="name"
                ></v-text-field>
                <v-btn block color="cyan" @click="add" :loading="processing">Add</v-btn>
            </v-form>
        </v-flex>
    </v-card>
</template>

<script>
	export default {
		name: "AddBucket",
		data() {
			return {
				name: '',
				processing: false
			}
		},
		methods: {
			async add() {
				this.processing = true;
				try {
					await this.$http({ method: 'POST', url: '/api/v1/buckets', data: { name: this.name } })
					this.processing = false;
					this.name = '';
					this.$emit('done');
				} catch (err) {
					// eslint-disable-next-line no-console
					console.dir(err)
				}
			}
		}
	}
</script>

<style scoped>

</style>