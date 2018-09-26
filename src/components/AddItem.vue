<template>
    <v-card>
        <v-card-title class="headline">New item</v-card-title>
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
		name: "AddItem",
		props: {
			bucket: {},
			visible: true,
		},
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
					const res = await this.$http({
						method: 'POST',
						url: `/api/v1/buckets/${this.bucket._id}/items`,
						data: { name: this.name }
					});
					// eslint-disable-next-line no-console
					console.dir(res);
					this.processing = false;
					this.name = '';
					this.$emit('done');
				} catch (err) {
					// eslint-disable-next-line no-console
					console.dir({ err });
					this.processing = false;
				}
			}
		}
	}
</script>