<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="4">
        <stats-card
          title="Daemon Version"
          icon="mdi-server"
          subText="Your current Daemon version"
        >{{ appcdVersion }}</stats-card>
      </v-col>
      <v-col cols="4">
        <stats-card
          title="Node Version"
          icon="mdi-nodejs"
          subText="Node version the Daemon is running"
        >{{ nodeVersion }}</stats-card>
      </v-col>
      <v-col cols="4">
        <stats-card
          title="Uptime"
          icon="mdi-clock-check-outline"
          subText="Time since Daemon was started"
        >
          <timeago :datetime="uptime" :converter="uptimeConverter" :auto-update="uptimeUpdateInterval" />
        </stats-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <dashboard-card>
          <v-card-title>Memory Usage</v-card-title>
          <v-sparkline :value="heap" color="#00b3a4" :line-width="2" auto-draw />
        </dashboard-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import formatDistanceStrict from 'date-fns/formatDistanceStrict'

import SYSTEM from '@/graphql/system/system.gql'
import MEMORY from '@/graphql/system/memory.gql'

export default {
  data: () => ({
    system: {
      uptime: 0
    },
    memory: []
  }),
  apollo: {
    system: {
      query: SYSTEM,
      fetchPolicy: 'network-only'
    },
    memory: {
      query: MEMORY,
      fetchPolicy: 'network-only'
    }
  },
  computed: {
    appcdVersion () {
      return this.system.appcdVersion
    },
    nodeVersion () {
      return this.system.nodeVersion
    },
    uptime () {
      return Date.now() - (this.system.uptime) * 1000
    },
    uptimeUpdateInterval () {
      if (this.system.uptime < 60) {
        return 1
      } else {
        return 60
      }
    },
    heap () {
      return this.memory.map(m => m.heapUsed)
    }
  },
  methods: {
    uptimeConverter (date, locale, converterOptions) {
      return formatDistanceStrict(date, Date.now())
    }
  }
}
</script>
