<template>
    <v-flex>
        <v-toolbar tabs color="blue">
            <v-toolbar-title>Buckets</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn flat @click="searchDialog = true">
                    <v-icon>search</v-icon>
                </v-btn>
                <v-btn flat @click="addBucketDialog = true">Add New Bucket</v-btn>
                <v-btn flat @click="logout">Logout</v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-container>
            <v-row col2>
                <v-flex v-for="bucket of buckets" :key="bucket._id" mb-3 sm12>
                    <v-card color="blue-grey darken-2" class="white--text">
                        <v-card-title primary-title>
                            <div class="headline">{{ bucket.name }}</div>
                        </v-card-title>
                        <v-card-actions>
                            <v-btn color="blue" flat @click="addItem(bucket)">
                                <v-icon left>add</v-icon>
                                Add new item
                            </v-btn>
                            <v-btn color="blue" @click="preview(bucket)">View items</v-btn>
                            <v-btn color="red" flat @click="deleteBucket(bucket)">
                                <v-icon left>delete</v-icon>
                                Delete
                            </v-btn>
                        </v-card-actions>
                        <v-divider mt-2></v-divider>
                    </v-card>
                </v-flex>
            </v-row>
            <div text-center v-if="!buckets.length">You don't have any bucket.</div>
        </v-container>

        <!-- DIALOGS-->
        <!-- PREVIEW BUCKET -->

        <v-dialog
                v-model="previewDialog"
                max-width="400"
        >
            <Bucket :bucket="current" :visible="previewDialog"/>
        </v-dialog>

        <!-- ADD ITEM -->

        <v-dialog v-model="addItemDialog" max-width="400">
            <AddItem :bucket="current" :visible="addItemDialog" v-on:done="fetch()"></AddItem>
        </v-dialog>

        <!-- ADD BUCKET -->

        <v-dialog v-model="addBucketDialog" max-width="400">
            <AddBucket :visible="addBucketDialog" v-on:done="fetch()"></AddBucket>
        </v-dialog>

        <!-- SEARCH -->

        <v-dialog v-model="searchDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <Search :visible="searchDialog" v-on:done="searchDialog = false"></Search>
        </v-dialog>

    </v-flex>
</template>

<script>
	import Bucket from "../components/Bucket";
	import AddItem from "../components/AddItem";
	import AddBucket from "../components/AddBucket";
	import Search from "../components/Search";

	export default {
		name: "Buckets",
		components: { Search, AddBucket, AddItem, Bucket },
		data() {
			return {
				processing: false,
				buckets: [],
				previewDialog: false,
				addItemDialog: false,
				addBucketDialog: false,
                searchDialog: false,
				current: null
			}
		},
		methods: {
			preview(bucket) {
				this.current = bucket;
				this.previewDialog = true;
			},
			addItem(bucket) {
				this.current = bucket;
				this.addItemDialog = true;
			},
			async fetch() {
				this.addItemDialog = false;
				this.addBucketDialog = false;
				this.processing = true;
				try {
					const res = await this.$http({ method: 'GET', url: '/api/v1/buckets' });
					this.buckets = res.data.buckets;
					this.processing = false;
				} catch (err) {
					// eslint-disable-next-line no-console
					console.dir(err);
					this.processing = false;
				}
			},
			async deleteBucket(bucket) {
				try {
					await this.$http({ method: 'DELETE', url: `/api/v1/buckets/${bucket._id}` });
					this.fetch();
				} catch (err) {
					// eslint-disable-next-line no-console
					console.dir(err);
				}
			},
			logout() {
				localStorage.clear();
				this.$router.push('/');
			}
		},
		async created() {
			this.fetch();
		}
	}
</script>

