<template>
  <v-app-bar
    app
    clipped-left
    :elevation="8"
    width="100%"
  >
    <template #default>
      <v-container class="container--fluid pa-0">
        <v-row>
          <v-col class="shrink pa-0 my-auto">
            <v-list-item class="pe-0">
              <v-list-item-avatar>
                <v-icon
                  color="primary"
                  @click="$router.push('/')"
                  v-text="'mdi-home'"
                />
              </v-list-item-avatar>
            </v-list-item>
          </v-col>
          <v-col class="shrink pa-0">
            <v-list-item>
              <v-list-item-avatar v-if="mobile && !$route.meta.disableNavigation">
                <v-icon
                  color="primary"
                  @click="$emit('toggle-drawer')"
                >
                  mdi-menu
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-avatar v-if="!$route.meta.disableNavigation">
                <v-icon
                  color="primary"
                  @click="$router.push({name: 'datasets'})"
                >
                  mdi-swap-horizontal-bold
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content v-if="dataset?.name">
                <v-list-item-title class="caption">
                  Current dataset:
                </v-list-item-title>
                <v-list-item-subtitle class="font-weight-bold subtitle-1">
                  <v-tooltip>
                    <template #activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ dataset?.name }}
                      </span>
                    </template>
                    <span>ID: {{ dataset?.id }}</span>
                  </v-tooltip>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content v-else>
                <v-list-item-title class="subtitle-1 text-danger">
                  Select a dataset
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-spacer />
          <!-- Backend Selector -->
          <v-col class="shrink pa-0 my-auto mr-3">
            <v-btn-toggle
              v-model="activeBackend"
              mandatory
              dense
              borderless
              color="primary"
            >
              <v-btn
                small
                value="mongo"
                @click="onSelectBackend('mongo')"
              >
                <v-icon small left>mdi-leaf</v-icon>
                MongoDB
              </v-btn>
              <v-btn
                small
                value="neo4j"
                @click="onSelectBackend('neo4j')"
              >
                <v-icon small left>mdi-graphql</v-icon>
                Neo4j
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col class="shrink pa-0 mr-4">
            <v-list-item class="d-flex">
              <v-list-item-avatar
                class="white--text"
                color="accent"
              >
                {{ userName.substring(0, 1).toUpperCase() }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ userName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ user?.email }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col class="shrink pa-0 my-auto mr-4">
            <v-menu>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-menu-down
                </v-icon>
              </template>
              <v-list v-if="isAuthenticated">
                <v-list-item @click="account()">
                  <v-list-item-icon>
                    <v-icon v-text="'mdi-account'" />
                  </v-list-item-icon>
                  <v-list-item-title>Account</v-list-item-title>
                </v-list-item>
                <v-list-item @click="logout()">
                  <v-list-item-icon>
                    <v-icon v-text="'mdi-logout'" />
                  </v-list-item-icon>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
              <v-list v-else>
                <v-list-item @click="login()">
                  <v-list-item-icon>
                    <v-icon v-text="'mdi-login'" />
                  </v-list-item-icon>
                  <v-list-item-title>Login</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-app-bar>
</template>

<script>
import AuthService from '@/services/AuthService';
import { mapState } from 'vuex';

export default {
  name: 'MainAppBar',
  props: {
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userName: '',
      isAuthenticated: false,
    };
  },
  computed: {
    ...mapState({
      dataset: state => state.dataset,
      user: state => state.user,
      apiBackend: state => state.apiBackend,
    }),
    activeBackend: {
      get() {
        return this.$store.state.apiBackend || 'mongo';
      },
      set(val) {
        if (val && val !== this.$store.state.apiBackend) {
          this.$store.dispatch('switchApiBackend', val);
        }
      },
    },
  },
  mounted() {
    this.userName = AuthService.getIdTokenParsed()?.preferred_username || 'Guest';
    this.isAuthenticated = AuthService.isAuthenticated();
  },
  methods: {
    async onSelectBackend(backend) {
      if (backend === this.$store.state.apiBackend) return;
      await this.$store.dispatch('switchApiBackend', backend);
      if (this.$route.name !== 'datasets') {
        this.$router.push({ name: 'datasets' });
      } else {
        // Force refresh current datasets view
        this.$router.go(0);
      }
    },
    logout() {
      AuthService.logout();
      this.$router.push('/login');
    },
    account() {
      AuthService.accountManagement();
    },
    login() {
      AuthService.login();
      this.$router.push('/login');
    },
  },
};
</script>

