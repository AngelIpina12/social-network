import { createSelector, createSlice } from '@reduxjs/toolkit';
import { publicationApi } from '../apis/publicationApi';

const initialState = {
    feed: {
        ids: [],
        entities: {},
        totalPages: 0,
        currentPage: 1,
        loading: false,
        error: null,
    },
    userPublications: {
        ids: [],
        entities: {},
        totalPages: 0,
        currentPage: 1,
        loading: false,
        error: null,
    },
    selectedPublication: null,
};

const publicationSlice = createSlice({
    name: 'publication',
    initialState,
    reducers: {
        addPublication: (state, action) => {
            const newPublication = action.payload;
            if (newPublication.user._id === state.userPublications.entities[state.userPublications.ids[0]]?.user._id
                && !state.userPublications.entities[newPublication._id]) {
                state.userPublications.ids.unshift(newPublication._id);
                state.userPublications.entities[newPublication._id] = newPublication;
            }
        },
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
        },
        removePublication: (state, action) => {
            const id = action.payload;
            if (state.userPublications.entities[id]) {
                delete state.userPublications.entities[id];
                state.userPublications.ids = state.userPublications.ids.filter(pubId => pubId !== id);
            }
        },
        resetPublicationState: (state) => {
            state.feed = {
                ids: [],
                entities: {},
                totalPages: 0,
                currentPage: 1,
                loading: false,
                error: null,
            };
            state.userPublications = {
                ids: [],
                entities: {},
                totalPages: 0,
                currentPage: 1,
                loading: false,
                error: null,
            };
            state.selectedPublication = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                publicationApi.endpoints.createPublication.matchFulfilled,
                (state, { payload }) => {
                    if (payload.status === "success" && payload.publication) {
                        const currentUser = JSON.parse(localStorage.getItem('user'));
                        const newPublication = {
                            ...payload.publication,
                            user: currentUser
                        };
                        if (newPublication.user._id === state.userPublications.entities[state.userPublications.ids[0]]?.user._id
                            && !state.userPublications.entities[newPublication._id]) {
                            state.userPublications.ids.unshift(newPublication._id);
                            state.userPublications.entities[newPublication._id] = newPublication;

                        }
                    }
                }
            )
            .addMatcher(
                publicationApi.endpoints.uploadPublicationImage.matchFulfilled,
                (state, { payload }) => {
                    if (payload.status === "success" && payload.publication) {
                        const publicationId = payload.publication._id;
                        const imageFile = payload.publication.file;
                        if (state.userPublications.entities[publicationId]) {
                            state.userPublications.entities[publicationId].file = imageFile;
                        }
                    }
                }
            )
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
                    const { publications, totalPages, currentPage } = payload;

                    if (currentPage === 1) {
                        state.feed.ids = [];
                        state.feed.entities = {};
                        publications.forEach(pub => {
                            state.feed.ids.push(pub._id);
                            state.feed.entities[pub._id] = pub;
                        });
                    } else {
                        publications.forEach(pub => {
                            if (!state.feed.entities[pub._id]) {
                                state.feed.ids.push(pub._id);
                                state.feed.entities[pub._id] = pub;
                            }
                        });
                    }
                    state.feed.ids.sort((a, b) =>
                        new Date(state.feed.entities[b].created_at).getTime() -
                        new Date(state.feed.entities[a].created_at).getTime()
                    );
                    state.feed.totalPages = totalPages;
                    state.feed.currentPage = currentPage;
                    state.feed.loading = false;
                }
            )
            .addMatcher(
                publicationApi.endpoints.fetchUserFeed.matchRejected,
                (state, { error }) => {
                    state.feed.loading = false;
                    state.feed.error = error.message;
                }
            )
            .addMatcher(
                publicationApi.endpoints.fetchUserPublications.matchPending,
                (state) => {
                    state.userPublications.loading = true;
                    state.userPublications.error = null;
                }
            )
            .addMatcher(
                publicationApi.endpoints.fetchUserPublications.matchFulfilled,
                (state, { payload, meta }) => {
                    const { publications, totalPages, currentPage } = payload;

                    if (currentPage === 1) {
                        state.userPublications.ids = [];
                        state.userPublications.entities = {};
                        publications.forEach(pub => {
                            state.userPublications.ids.push(pub._id);
                            state.userPublications.entities[pub._id] = pub;
                        });
                    } else {
                        publications.forEach(pub => {
                            if (!state.userPublications.entities[pub._id]) {
                                state.userPublications.ids.push(pub._id);
                                state.userPublications.entities[pub._id] = pub;
                            }
                        });
                    }
                    state.userPublications.ids.sort((a, b) =>
                        new Date(state.userPublications.entities[b].created_at).getTime() -
                        new Date(state.userPublications.entities[a].created_at).getTime()
                    );
                    state.userPublications.totalPages = totalPages;
                    state.userPublications.currentPage = currentPage;
                    state.userPublications.loading = false;
                }
            )
            .addMatcher(
                publicationApi.endpoints.fetchUserPublications.matchRejected,
                (state, { error }) => {
                    state.userPublications.loading = false;
                    state.userPublications.error = error.message;
                }
            )
            .addMatcher(
                publicationApi.endpoints.deletePublication.matchFulfilled,
                (state, { payload, meta }) => {
                    const id = meta.arg.publicationId;
                    if (state.userPublications.entities[id]) {
                        delete state.userPublications.entities[id];
                        state.userPublications.ids = state.userPublications.ids.filter(pubId => pubId !== id);
                    }
                    if (state.selectedPublication && state.selectedPublication._id === id) {
                        state.selectedPublication = null;
                    }
                }
            )
            .addMatcher(
                publicationApi.endpoints.fetchPublicationDetail.matchFulfilled,
                (state, { payload }) => {
                    if (payload && payload.publication) {
                        state.selectedPublication = payload.publication;
                    }
                }
            );
    },
});

const selectFeedState = state => state.publicationData.feed;
const selectUserPublicationsState = state => state.publicationData.userPublications;

export const getFeedPublications = createSelector(
    [selectFeedState],
    (feed) => {
        return feed.ids.map(id => feed.entities[id]);
    }
);

export const getUserPublications = createSelector(
    [selectUserPublicationsState],
    (userPublications) => {
        return userPublications.ids.map(id => userPublications.entities[id]);
    }
);

export const {
    addPublication,
    setCurrentPage,
    setSelectedPublication,
    clearSelectedPublication,
    removePublication,
    resetPublicationState,
} = publicationSlice.actions;
export const publicationReducer = publicationSlice.reducer;