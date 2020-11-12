<template>
  <v-navigation-drawer app clipped color="grey lighten-4">
    <v-list class="grey lighten-4">
      <template v-for="(item, i) in items">
        <v-subheader v-if="item.heading" :key="i">
          {{ $t(item.heading) }}
        </v-subheader>
        <v-divider
          v-else-if="item.divider"
          :key="i"
          dark
          class="my-4"
        ></v-divider>
        <v-list-item
          v-else
          :key="i"
          active-class="primary--text"
          link
          :to="{ name: item.name }"
        >
          <v-list-item-action>
            <v-icon color="primary">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="grey--text">
              {{ $t(item.title) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import VIEWS from '@/graphql/view/views.gql'

export default {
  data () {
    return {
      views: []
    }
  },
  apollo: {
    views: {
      query: VIEWS
    }
  },
  computed: {
    items () {
      const navGroups = new Map()
      const items = []
      this.views.forEach(view => {
        let group = navGroups.get(view.group)
        if (!group) {
          group = []
          navGroups.set(view.group, group)
        }
        group.push(view)
      })
      navGroups.forEach((groupItems, groupTitle) => {
        items.push({ heading: groupTitle }, ...groupItems)
      })
      return items
    }
  }
  // TODO: Computed prop to list built in views and global plugins when no project selected,
  // project specific plugins otherwise
}
</script>
