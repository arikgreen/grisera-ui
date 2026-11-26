import roles from '@/acl/roles';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import config from '../../config.js';
import { setApiBaseUrl } from '@/api/BaseAPI2';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    apiBackend: 'mongo', // 'mongo' | 'neo4j'
    datasets: [],
    dataset: undefined,
    user: undefined,
    permissions: undefined,
    scopes: {},
    data: undefined,
    imports: [],
  },
  mutations: {
    setApiBackend(state, backend) {
      state.apiBackend = backend === 'neo4j' ? 'neo4j' : 'mongo';
      const targetUrl = state.apiBackend === 'neo4j' ? config.neo4jApiUrl : config.apiUrl;
      setApiBaseUrl(targetUrl);
    },
    setDatasets(state, values) {
      state.datasets = [...values];
    },
    setDataset(state, value) {
      state.dataset = value ? { ...value } : undefined;
    },
    setUser(state, value) {
      state.user = value ? { ...value } : undefined;
    },
    setPermissions(state, value) {
      state.permissions = value;

      if (!Array.isArray(value)) {
        console.error('Permissions should be an array of { datasetId, role } objects');
        return;
      }

      value.forEach(({ datasetId, role }) => state.scopes[datasetId] = roles[role] || []);
    },
    setData(state, value) {
      state.data = value ? { ...value } : undefined;
    },
    addImport(state, importData) {
      console.log('Store: Adding import:', importData);
      state.imports.push({
        id: importData.id,
        status: importData.status,
        file_name: importData.file_name,
        dataset_id: importData.dataset_id,
        created_at: importData.created_at || new Date().toISOString(),
        description: importData.description,
      });
      console.log('Store: Imports after adding:', state.imports);
    },
    removeImport(state, importId) {
      state.imports = state.imports.filter(imp => imp.id !== importId);
    },
    clearCompletedImports(state) {
      state.imports = state.imports.filter(imp =>
        imp.status !== 'completed' && imp.status !== 'failed',
      );
    },
    clearAllImports(state) {
      console.log('Store: Clearing all imports');
      state.imports = [];
    },
    setImports(state, imports) {
      console.log('Store: Setting imports:', imports);
      state.imports =
        imports.map(imp => (
          {
            ...imp,
            created_at: imp.created_at || new Date().toISOString(),
          }
        ));
    },
  },
  actions: {
    switchApiBackend({ commit }, backend) {
      commit('setApiBackend', backend);
      commit('setDataset', undefined);
      commit('setDatasets', []);
    },
  },
  getters: {
    getApiBackend: state => state.apiBackend || 'mongo',
    getUser: state => state.user,
    getDataset: state => state.dataset,
    getPermission: state => state.permissions?.find(permission => permission.datasetId == state.dataset?.id),
    getActiveImports: state => {
      const activeImports = state.imports.filter(imp =>
        imp.status === 'pending' || imp.status === 'processing',
      );
      console.log('Store getActiveImports:', activeImports);
      return activeImports;
    },
    getAllImports: state => {
      console.log('Store getAllImports:', state.imports);
      return state.imports;
    },
    hasActiveImports: state => {
      const hasActive = state.imports.some(imp =>
        imp.status === 'pending' || imp.status === 'processing',
      );
      console.log('Store hasActiveImports:', hasActive, 'imports:', state.imports);
      return hasActive;
    },
  },
  plugins: [
    createPersistedState({
      paths: ['apiBackend', 'dataset'],
    }),
  ],
});

Vue.prototype.$store = store;

export default store;
