<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col
        :cols="12"
        class="headline font-weight-bold my-auto d-flex"
      >
        <app-breadcrumbs />
      </v-col>
      <v-col
        v-for="score in scores"
        :key="`score_${ score.title }`"
        class="col-3"
        @click="score.url ? $router.push(score.url) : () => undefined"
      >
        <dashboard-info-card
          :loading="score.loading"
          :score="score.score"
          :title="score.title"
        />
      </v-col>
      <v-col class="col-12">
        <dataset-card
          v-if="currentDataset && currentDataset !== 'undefined'"
          :has-title="true"
          :title="`You are currently working on the following dataset: ${currentDataset}`"
        />
        <div
          v-else-if="noDatasets"
          class="subtitle-1 font-weight-light"
          style="line-height: 1.6; color: red;"
        >
          There are no datasets available. Please contact the administrator.<br>
          You can also create a new dataset by navigating to the <router-link to="/datasets">
            Datasets page
          </router-link>.
        </div>
        <div
          v-else
          class="subtitle-1 font-weight-light"
          style="line-height: 1.6; color: orangered;"
        >
          Please select a dataset to view its details. You can do this by navigating to the <router-link to="/datasets">
            Datasets page
          </router-link>.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ActivitiesAPI from '@/api/ActivitiesAPI';
import ExperimentsAPI from '@/api/ExperimentsAPI';
import ParticipantsAPI from '@/api/ParticipantsAPI';
import TimeSeriesAPI from '@/api/TimeSeriesApi';
import DatasetAPI from '@/api/DatasetAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import DashboardInfoCard from '@/components/DashboardInfoCard.vue';
import DatasetCard from '@/components/DatasetCard.vue';

export default {
  name: 'MainView',
  components: {
    AppBreadcrumbs,
    DashboardInfoCard,
    DatasetCard,
  },
  data() {
    return {
      datasets: [], // Will be populated from API
      breadcrumbs: [],
      scores: [
        { title: 'Total experiments', url: '/experiments', loading: true },
        { title: 'Total activities', url: '/activities', loading: true },
        { title: 'Total participants', url: '/participants', loading: true },
        { title: 'Total time series', loading: true },
      ],
      noDatasets: false, // Will be set after datasets are loaded
      currentDataset: this.$store.state.dataset?.name || undefined,
    };
  },
  methods: {
    async loadDatasets() {
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
  },
  async created() {
    try {
      // Load datasets first
      await this.loadDatasets();

      console.log('Fetching dashboard statistics...');
      console.log('Current dataset:', this.currentDataset);

      if (this.currentDataset === 'undefined' || !this.currentDataset) {
        this.scores = this.scores.map(score => ({ ...score, loading: false, score: 'N/A' }));
        return;
      }

      const updatedScores = await Promise.all([
        { title: 'Total experiments', url: '/experiments', score: await ExperimentsAPI.count() },
        { title: 'Total activities', url: '/activities', score: await ActivitiesAPI.count() },
        { title: 'Total participants', url: '/participants', score: await ParticipantsAPI.count() },
        { title: 'Total time series', score: await TimeSeriesAPI.count() },
      ]);
      this.scores = updatedScores.map(score => ({ ...score, loading: false }));
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      this.scores = this.scores.map(score => ({ ...score, loading: false, score: 'Error' }));
    }
  },
};
</script>
