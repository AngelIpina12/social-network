import { createSlice } from '@reduxjs/toolkit';
import { publicationsAdapter, publicationApi } from '../apis/publicationApi';

const initialState = {
  feed: publicationsAdapter.getInitialState({
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
  }),
  userPublications: publicationsAdapter.getInitialState({
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
  }),
  selectedPublication: null
};

const publicationSlice = createSlice({
  name: 'publication',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      const { section, page } = action.payload;
      if (section === 'feed') {
        state.feed.currentPage = page;
      } else if (section === 'userPublications') {
        state.userPublications.currentPage = page;
      }
    },
    setSelectedPublication: (state, action) => {
      state.selectedPublication = action.payload;
    },
    clearSelectedPublication: (state) => {
      state.selectedPublication = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Feed de publicaciones
      .addMatcher(
        publicationApi.endpoints.fetchUserFeed.matchPending,
        (state, { meta }) => {
          state.feed.loading = true;
          state.feed.error = null;
        }
      )
      .addMatcher(
        publicationApi.endpoints.fetchUserFeed.matchFulfilled,
        (state, { payload, meta }) => {
          const { ids, entities, totalPages, currentPage } = payload;
          if (currentPage === 1) {
            publicationsAdapter.setAll(state.feed, entities);
          } else {
            publicationsAdapter.upsertMany(state.feed, entities);
          }
          state.feed.totalPages = totalPages;
          state.feed.currentPage = currentPage;
          state.feed.loading = false;
        }
      )
      .addMatcher(
        publicationApi.endpoints.fetchUserFeed.matchRejected,
        (state, { error }) => {
          state.feed.loading = false;
          state.feed.error = error.message || 'Error al cargar el feed';
        }
      )
      // Publicaciones de usuario
      .addMatcher(
        publicationApi.endpoints.fetchUserPublications.matchPending,
        (state) => {
          state.userPublications.loading = true;
          state.userPublications.error = null;
        }
      )
      .addMatcher(
        publicationApi.endpoints.fetchUserPublications.matchFulfilled,
        (state, { payload }) => {
          const { ids, entities, totalPages, currentPage } = payload;
          if (currentPage === 1) {
            publicationsAdapter.setAll(state.userPublications, entities);
          } else {
            publicationsAdapter.upsertMany(state.userPublications, entities);
          }
          state.userPublications.totalPages = totalPages;
          state.userPublications.currentPage = currentPage;
          state.userPublications.loading = false;
        }
      )
      .addMatcher(
        publicationApi.endpoints.fetchUserPublications.matchRejected,
        (state, { error }) => {
          state.userPublications.loading = false;
          state.userPublications.error = error.message || 'Error al cargar las publicaciones';
        }
      )
      // Detalles de publicación
      .addMatcher(
        publicationApi.endpoints.fetchPublicationDetail.matchFulfilled,
        (state, { payload }) => {
          if (payload && payload.publication) {
            state.selectedPublication = payload.publication;
          }
        }
      )
      // Actualizar tras crear una publicación
      .addMatcher(
        publicationApi.endpoints.createPublication.matchFulfilled,
        (state, { payload }) => {
          // No necesitamos actualizar manualmente ya que se recargarán 
          // con la invalidación de tags
        }
      );
  }
});

export const getFeedPublications = (state) => {
  const { ids, entities } = state.publicationData.feed;
  return ids.map(id => entities[id]);
};

export const getUserPublications = (state) => {
  const { ids, entities } = state.publicationData.userPublications;
  return ids.map(id => entities[id]);
};

export const {
  setCurrentPage,
  setSelectedPublication,
  clearSelectedPublication
} = publicationSlice.actions;
export const publicationReducer = publicationSlice.reducer;