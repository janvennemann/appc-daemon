<template>
  <v-app-bar fixed app clipped-left color="#0e1f25" dark>
    <v-toolbar-title>
      <router-link to="/" class="d-flex title-link">
        <img src="@/assets/axway-logo.png" height="30" class="pr-3" />
        <span>Appcd Dashboard</span>
      </router-link>
    </v-toolbar-title>
    <v-spacer />
    <v-toolbar-items>
      <v-btn
        icon
        href="https://github.com/appcelerator/appc-daemon"
        target="_blank"
      >
        <v-icon>mdi-github-circle</v-icon>
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>
