<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between px-4">
          <h2>Plugins</h2>
          <v-btn color="primary">
            <v-icon left>mdi-sync</v-icon> Reload
          </v-btn>
        </div>
      </v-col>
      <v-col cols="6">
        <dashboard-card>
          <v-card-title>Project</v-card-title>
          <v-card-subtitle>Project plugins</v-card-subtitle>
        </dashboard-card>
      </v-col>
      <v-col cols="6">
        <dashboard-card>
          <v-card-title>
            <div class="d-flex flex-grow-1 justify-space-between">
              <span>Global</span>
              <v-tooltip left max-width="200">
                <template v-slot:activator="{ on }">
                  <v-icon color="grey" dark v-on="on">mdi-information-outline</v-icon>
                </template>
                <span>Only one version of each globally installed plugin can provide a UI addon. Change the version to load a different UI addon.</span>
              </v-tooltip>
            </div>
          </v-card-title>
          <v-card-subtitle>Global Daemon plugins</v-card-subtitle>

          <v-list>
            <v-list-item two-line v-for="plugin in globalPlugins" :key="plugin.name">
              <v-list-item-content>
                <v-list-item-title>{{ plugin.name }}</v-list-item-title>
                <v-list-item-subtitle>Description</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-menu bottom left offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn color="primary" v-on="on">{{ plugin.current.version }}</v-btn>
                  </template>

                  <v-list>
                    <v-list-item
                      two-line
                      v-for="version in plugin.versions"
                      :key="version.version"
                      @click="makeCurrent(plugin, version)"
                      :class="listItemClasses(plugin, version)"
                      :disabled="!!version.error"
                    >
                      <v-list-item-content class="text-right">
                        <v-list-item-title>{{ version.version }}</v-list-item-title>
                        <v-list-item-subtitle>
                          Plugin Status:
                          <v-chip :color="versionStatusColor(version)" label small>
                            {{ versionStatusText(version) }}
                          </v-chip>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </dashboard-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GLOBAL_PLUGINS from '@/graphql/plugin/global.gql'

export default {
  data: () => ({
    globalPlugins: []
  }),
  apollo: {
    globalPlugins: GLOBAL_PLUGINS
  },
  methods: {
    makeCurrent (plugin, version) {
      plugin.current = version
    },
    listItemClasses (plugin, version) {
      if (plugin.current.version === version.version) {
        return ['primary--text', 'v-list-item--active']
      } else {
        return []
      }
    },
    versionStatusColor (version) {
      if (version.error) {
        return 'error'
      } else if (version.pid) {
        return 'grey lighten-2'
      } else {
        return 'primary'
      }
    },
    versionStatusText (version) {
      if (version.error) {
        return 'Unsupported'
      } else if (version.pid) {
        return 'Active'
      } else {
        return 'Inactive'
      }
    }
  }
}
</script>
