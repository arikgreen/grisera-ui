<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <app-breadcrumbs />
      </v-col>
      <v-col class="text-right">
        <v-btn
          :outlined="true"
          @click.prevent.stop="resetStorage"
        >
          Reset storage
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col">
        <!-- Multiselect Filters Placeholder -->
        <v-card>
          <v-card-title class="py-2">
            Datasets Filter
          </v-card-title>
          <v-card-text>
            <select
              v-model="selectedDatasets"
              multiple
              chips
              outlined
              dense
              hide-details
              style="border: 1px solid #ccc; width: 100%;"
              class="py-2 px-1"
            >
              <option
                v-for="dataset in datasets"
                :key="dataset.id"
                :value="dataset.id"
              >
                {{ dataset.name }}
              </option>
            </select>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col">
        <!-- Multiselect Filters Placeholder -->
        <v-card>
          <v-card-title class="py-2">
            Areas Filter
          </v-card-title>
          <v-card-text>
            <div
              class="d-flex flex-column"
              style="border: 1px solid #ccc; width: 100%; height: 100%;"
            >
              <div class="d-flex flex-wrap">
                <v-checkbox
                  v-model="selectedCollections"
                  label="Activities"
                  value="collectionActi"
                  hide-details
                  dense
                  class="mr-4"
                />
                <v-checkbox
                  v-model="selectedCollections"
                  label="Experiments"
                  value="collectionExpe"
                  hide-details
                  dense
                  class="mr-4"
                />
                <v-checkbox
                  v-model="selectedCollections"
                  label="Measurements"
                  value="collectionMeas"
                  hide-details
                  dense
                  class="mr-4"
                />
                <v-checkbox
                  v-model="selectedCollections"
                  label="Participants"
                  value="collectionPart"
                  hide-details
                  dense
                  class="mr-4"
                />
                <v-checkbox
                  v-model="selectedCollections"
                  label="Channels"
                  value="collectionChan"
                  hide-details
                  dense
                />
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-12">
        <v-row>
          <v-col cols="10">
            <v-text-field
              v-model="searchText"
              label="What are you looking for?"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col
            class="d-flex align-center"
            cols="2"
          >
            <v-btn
              color="primary"
              block
              @click="search"
            >
              Search
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col 
        v-model="searchResultsText"
        class="col-12"
      >
        <!-- Search Results Placeholder -->
        {{ searchResultsText }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LocalStorageService from '@/storage/LocalStorageService';
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
      collections: [],
      searchText: '',
      searchResultsText: 'Search Results will be displayed here.',
    };
  },
  async created() {
      await this.fetchDatasets();
  },
  methods: {
    resetStorage() {
      LocalStorageService.clear();
      LocalStorageService.init();
    },
    async fetchDatasets() {
      try {
        console.log('Loading datasets...');
        const response = await DatasetAPI.index();
        this.datasets = response.data || [];
        this.noDatasets = this.datasets.length === 0;
        console.log('Datasets count:', this.datasets.length);
      } catch (error) {
        console.error('Error loading datasets:', error);
        this.datasets = [];
        this.noDatasets = true;
      }
    },
    async search() {
      // Placeholder for search functionality
      console.log('Performing search with filters:', {
        datasets: this.selectedDatasets,
        collections: this.selectedCollections,
        searchText: this.searchText,
      });
      // Get activities from selected datasets
      let activitiesFromDatasets = [];
      if (this.searchText.length > 3 && this.selectedDatasets.length > 0) {
        try {
          for (const datasetId of this.selectedDatasets) {
            const response = await SearchAPI.search_in_dataset(datasetId, this.searchText);
            if (response.data) {
              activitiesFromDatasets = [...activitiesFromDatasets, ...response.data];
            }
          }
        } catch (error) {
          console.error('Error fetching activities from datasets:', error);
        }
      }
      else {
        // show modal or notification about insufficient input
        console.warn('Please enter at least 4 characters and select at least one dataset to perform a search.');
        alert('Please enter at least 4 characters and select at least one dataset to perform a search.');
        return;
      }
      // // Filter activities based on search text
      // if (this.searchText) {
      //   const filteredActivities = activitiesFromDatasets.filter(activity => 
      //     activity.name && activity.name.toLowerCase().includes(this.searchText.toLowerCase())
      //   );
      //   console.log('Filtered activities:', filteredActivities);
      // }

      this.searchResultsText = `Search performed with query: "${this.searchText}" and selected filters.`;
      this.searchResultsText += ` Found ${activitiesFromDatasets.length} from selected datasets.`;
    },
  },
};
</script>
