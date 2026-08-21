<template>
  <v-app>
    <!-- Main App Bar -->
    <main-app-bar
      v-if="!hideMainAppBar"
      :mobile="$vuetify.breakpoint.mobile"
      @toggle-drawer="toggleDrawer"
    />
    <!-- Navigation Drawer -->
    <main-navigation-drawer
      v-if="!hideNavigationDrawer"
      :collapse.sync="collapse"
      :mobile="$vuetify.breakpoint.mobile"
      :drawer.sync="drawer"
    />
    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import MainNavigationDrawer from '@/components/MainNavigationDrawer.vue';
import MainAppBar from '@/components/MainAppBar.vue';

export default {
  components: {
    MainAppBar,
    MainNavigationDrawer,
  },
  data() {
    return {
      collapse: false,
      drawer: null,
    };
  },
  computed: {
    hideNavigationDrawer() {
      return this.$route.meta?.disableNavigation === true;
    },
    hideMainAppBar() {
      return this.$route.meta?.disableMainAppBar === true;
    },
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

#app {
  background-color: #f5f5f5;
}

body {
  font-family: 'Roboto', serif;
  font-weight: normal;
}
</style>
