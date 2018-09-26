<template>
    <v-app id="app" dark>
        <router-view/>
    </v-app>
</template>

<script>
	export default {
        name: 'App'
	}
</script>

<style>
    #app {
        font-family: 'Montserrat', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    body {
        font-size: 14px!important;
    }
</style>
