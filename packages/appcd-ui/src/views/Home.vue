<template>
  <div class="dashboard-home">
    <TopNavbar />

    <SideNavbar />

    <v-slide-y-transition>
      <v-system-bar
        v-show="showConnectionAlert"
        fixed
        color="red"
        dark
        height="40"
        class="connection-alert"
      >
        <v-row>
          <v-col cols="12" class="text-center">
            <v-icon class="mr-3">mdi-cloud-off-outline</v-icon>
            <span>Disconnected from Appc Daemon!</span>
          </v-col>
        </v-row>
      </v-system-bar>
    </v-slide-y-transition>

    <v-content>
      <router-view />
    </v-content>

    <v-footer class="grey--text" app dark color="#0e1e24">
      <span class="copyright">&copy; 2019 Axway Appcelerator</span>
    </v-footer>
  </div>
</template>

<style lang="sass">
.intro-logo
  width: 80px
</style>
