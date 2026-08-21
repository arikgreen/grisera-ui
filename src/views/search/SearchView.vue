<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <app-breadcrumbs />
      </v-col>
      <v-col class="text-right">
        <v-btn
          :outlined="true"
          @click.prevent.stop="resetFilters"
        >
          Reset Filters
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtry -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title class="py-2 subtitle-1 font-weight-bold">
            Datasets
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedDatasets"
              :items="datasetItems"
              label="Select Datasets *"
              multiple
              chips
              small-chips
              outlined
              dense
              deletable-chips
              :loading="loadingDatasets"
              placeholder="All allowed datasets if empty"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card outlined>
          <v-card-title class="py-2 subtitle-1 font-weight-bold">
            Collections Filter
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedCollections"
              :items="availableCollections"
              label="Filter Collections"
              multiple
              chips
              small-chips
              outlined
              dense
              deletable-chips
              placeholder="All collections by default"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pasek wyszukiwania -->
    <v-row class="mt-2">
      <v-col cols="12">
        <v-row>
          <v-col cols="12" sm="10">
            <v-text-field
              v-model="searchText"
              label="What are you looking for?"
              outlined
              dense
              clearable
              prepend-inner-icon="mdi-magnify"
              @keydown.enter="triggerNewSearch"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn
              color="primary"
              height="40"
              block
              :loading="loadingSearch"
              :disabled="loadingSearch"
              @click="triggerNewSearch"
            >
              Search
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Tabela z wynikami -->
    <v-row class="mt-2">
      <v-col cols="12">
        <v-card outlined>
          <v-card-title class="py-2 subtitle-1 font-weight-bold">
            Search Results ({{ totalResults }})
          </v-card-title>
          <v-data-table
            :headers="tableHeaders"
            :items="searchResults"
            :loading="loadingSearch"
            :server-items-length="totalResults"
            :options.sync="tableOptions"
            :footer-props="{
              'items-per-page-options': [5, 10, 25, 50]
            }"
            class="elevation-0"
            no-data-text="No results found. Adjust query or filters."
          >
            <!-- Formatowanie snippetu -->
            <template #[`item.snippet`]="{ item }">
              <span class="font-italic text--secondary">{{ item.snippet }}</span>
            </template>

            <!-- Formatowanie etykiety kolekcji -->
            <template #[`item.collection`]="{ item }">
              <v-chip small color="primary" outlined>
                {{ item.collection }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import DatasetAPI from '@/api/DatasetAPI';
import SearchAPI from '@/api/SearchAPI';

export default {
  name: 'SearchView',
  components: {
    AppBreadcrumbs,
  },
  data() {
    return {
      selectedDatasets: [],
      selectedCollections: [],
      datasets: [],
      searchText: '',
      searchResults: [],
      totalResults: 0,
      loadingDatasets: false,
      loadingSearch: false,

      // Dostępne kolekcje zgodnie ze schematem bazy Mongo
      availableCollections: [
        'activities',
        'arrangements',
        'channels',
        'experiments',
        'file_operation_errors',
        'file_operations',
        'life_activities',
        'measure_names',
        'measures',
        'modalities',
        'participants',
        'participations',
        'recordings',
        'registered_channels',
        'registered_data',
        'scenarios',
      ],

      // Opcje paginacji v-data-table
      tableOptions: {
        page: 1,
        itemsPerPage: 10,
      },

      tableHeaders: [
        { text: 'Dataset Name', value: 'dataset_name', width: '15%' },
        { text: 'Collection', value: 'collection', width: '20%' },
        { text: 'Document ID', value: 'id', width: '20%' },
        { text: 'Snippet / Match', value: 'snippet', width: '45%' },
      ],
    };
  },
  computed: {
    datasetItems() {
      return this.datasets.map(d => ({
        text: d.name || `Dataset ${d.id}`,
        value: d.id,
      }));
    },
  },
  watch: {
    tableOptions: {
      handler() {
        if (this.searchResults.length > 0) {
          this.executeSearch();
        }
      },
      deep: true,
    },
  },
  async created() {
    await this.fetchDatasets();
  },
  methods: {
    resetFilters() {
      this.selectedDatasets = [];
      this.selectedCollections = [];
      this.searchText = '';
      this.searchResults = [];
      this.totalResults = 0;
      this.tableOptions.page = 1;
    },
    async fetchDatasets() {
      this.loadingDatasets = true;
      try {
        const response = await DatasetAPI.index();
        this.datasets = response.data || [];
      } catch (error) {
        console.error('Error loading datasets:', error);
        this.datasets = [];
      } finally {
        this.loadingDatasets = false;
      }
    },
    triggerNewSearch() {
      this.tableOptions.page = 1;
      this.executeSearch();
    },
    async executeSearch() {
      // Jeśli użytkownik nie zaznaczył konkretnych datasetów, przeszukujemy wszystkie dostępne
      const targetDatasets = this.selectedDatasets.length > 0
        ? this.selectedDatasets
        : this.datasets.map(d => d.id);

      if (targetDatasets.length === 0) {
        alert('No accessible datasets found to search.');
        return;
      }

      this.loadingSearch = true;
      try {
        const payload = {
          dataset_ids: targetDatasets,
          text: this.searchText ? this.searchText.trim() : null,
          collections: this.selectedCollections.length > 0 ? this.selectedCollections : null,
          page: this.tableOptions.page,
          limit: this.tableOptions.itemsPerPage,
        };

        const response = await SearchAPI.search(payload);
        const data = response.data || {};

        this.searchResults = data.results || [];
        this.totalResults = data.total || 0;
      } catch (error) {
        console.error('Error during search operation:', error);
        this.searchResults = [];
        this.totalResults = 0;
      } finally {
        this.loadingSearch = false;
      }
    },
  },
};
</script>

<style scoped>
.v-select__selections {
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
}
</style>
