<template>
  <v-app>
    <div v-if="ready">
      <router-view />
    </div>
    <v-content v-else>
      <v-container fill-height class="justify-center">
        <v-progress-circular
          class="app-loadings"
          indeterminate
          :size="70"
          :width="7"
          color="primary"
        />
      </v-container>
    </v-content>

    <ClientAddonLoader />
  </v-app>
</template>

<script>
export default {
  metaInfo: {
    titleTemplate: chunk => chunk ? `${chunk} - Appcd UI [Beta] ` : 'Appcd UI [Beta] '
  },
  data () {
    return {
      ready: true
    }
  },
  created () {

  }
}
</script>

<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

.v-toolbar
  .title-link
    text-decoration: none
    color: map-deep-get($material-theme, 'text', 'theme')
.copyright
  font-size: 0.8rem

.theme--dark
  &.v-system-bar
    &.connection-alert
      z-index: 4
      top: 64px
      color: map-deep-get($material-dark, 'text', 'primary')
      & .v-icon
        color: map-deep-get($material-dark, 'text', 'primary')

.app-loading

</style>
