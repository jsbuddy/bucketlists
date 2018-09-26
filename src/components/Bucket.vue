<template>
    <v-card v-if="bucket">
        <v-card-title class="headline">{{ bucket.name }}</v-card-title>
        <v-list two-line subheader>
            <v-subheader>Items</v-subheader>
            <v-list-tile avatar v-for="item of bucket.items || []" :key="item._id">
                <v-list-tile-content>
                    <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                    <v-list-tile-sub-title>
                        <v-switch @change="e => update(e, item)" v-model="item.done" label="Done"></v-switch>
                    </v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar v-if="!bucket.items.length">
                <v-list-tile-content>
                    <v-list-tile-title>No Item</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </v-card>
</template>
<script>
	export default {
		name: 'Bucket',
		props: {
			bucket: {
				name: ''
			},
			visible: true
		},
		methods: {
			async update(e, item) {
				try {
					const data = { name: item.name, done: e };
					const res = await this.$http({
						method: 'PUT',
						url: `api/v1/buckets/${this.bucket._id}/items/${item._id}`,
						data
					});
					// eslint-disable-next-line no-mixed-spaces-and-tabs,no-console
					console.dir(res);

				} catch (err) {
					// eslint-disable-next-line no-mixed-spaces-and-tabs,no-console
					console.dir(err);

				}
			}
		}
	}
</script>
