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
            <v-select
              v-model="selectedDatasets"
              :items="datasets.map(dataset => ({ text: dataset.name, value: dataset.id }))"
              label="Select Datasets"
              multiple
              chips
              outlined
              dense
              hide-details
              style="border: 1px solid #ccc; width: 100%;"
              class="py-2 px-1"
            />
            <!-- apply button -->
            <v-btn
              color="primary"
              class="mt-2"
              @click="fetchDatasets"
            >
              Apply
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col">
        <v-card class="mt-4">
          <v-card-title class="py-2">
            Experiments
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedExperiments"
              :items="[
                { text: 'Experiment 1', value: 'experiment1' },
                { text: 'Experiment 2', value: 'experiment2' },
                { text: 'Experiment 3', value: 'experiment3' },
                { text: 'Experiment 4', value: 'experiment4' },
                { text: 'Experiment 5', value: 'experiment5' },
                { text: 'Experiment 6', value: 'experiment6' },
                { text: 'Experiment 7', value: 'experiment7' },
                { text: 'Experiment 8', value: 'experiment8' },
                { text: 'Experiment 9', value: 'experiment9' },
                { text: 'Experiment 10', value: 'experiment10' },
              ]"
              label="Select Experiments"
              multiple
              chips
              outlined
              dense
              hide-details
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col">
        <v-card class="mt-4">
          <v-card-title class="py-2">
            Participant sex
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedParticipantSex"
              :items="[
                { text: 'Female', value: 'female' },
                { text: 'Male', value: 'male' },
              ]"
              label="Select Participant sex"
              multiple
              chips
              outlined
              dense
              hide-details
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col">
        <v-card class="mt-4">
          <v-card-title class="py-2">
            Channels
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedChannels"
              :items="[
                { text: 'Channel X', value: 'channelX' },
                { text: 'Channel Y', value: 'channelY' },
                { text: 'Channel Z', value: 'channelZ' },
              ]"
              label="Select Channels"
              multiple
              chips
              outlined
              dense
              hide-details
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="col">
        <v-card class="mt-4">
          <v-card-title class="py-2">
            Measurements
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedMeasurements"
              :items="[
                { text: 'Measurement 1', value: 'measurement1' },
                { text: 'Measurement 2', value: 'measurement2' },
                { text: 'Measurement 3', value: 'measurement3' },
              ]"
              label="Select Measurements"
              multiple
              chips
              outlined
              dense
              hide-details
            />
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
<!-- styles -->
<style>
  .v-select__selections {
    margin-top: 0.8rem;
    margin-bottom: 0.3rem;
  }
</style>