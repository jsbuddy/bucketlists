<template>
    <v-card>
        <v-toolbar dark color="primary">
            <v-btn icon dark @click.native="$emit('done')">
                <v-icon>close</v-icon>
            </v-btn>
            <v-text-field append-icon="search" single-line label="Search" hide-details solo light>
            </v-text-field>
        </v-toolbar>
    </v-card>
</template>

<script>
	export default {
		name: "Search"
	}
</script>

<style scoped>

</style>