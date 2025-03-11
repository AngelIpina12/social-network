import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useFetchUserFeedQuery } from '../../store';
import { PublicationList } from '../publication/PublicationList';
import { getFeedPublications, setCurrentPage } from '../../store';

export const Feed = () => {
    const dispatch = useDispatch();
    const feedState = useSelector(state => state.publicationData.feed);
    const feedPublications = useSelector(getFeedPublications);

    // RTK Query with updated parameters
    const { error, isLoading, isFetching, refetch } = useFetchUserFeedQuery({
        page: feedState.currentPage
    });

    // Load more publications
    const nextPage = () => {
        if (feedState.currentPage < feedState.totalPages) {
            dispatch(setCurrentPage({ 
                section: 'feed',
                page: feedState.currentPage + 1 
            }));
        }
    };

    // Refresh publications
    const refreshPublications = () => {
        dispatch(setCurrentPage({ section: 'feed', page: 1 }));
        refetch();
    };

    if (error) {
        return <div className="content__error">Error loading feed: {error.message}</div>;
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button 
                    className="content__button" 
                    onClick={refreshPublications}
                    disabled={isFetching}
                >
                    {isFetching ? 'Loading...' : 'Show new'}
                </button>
            </header>
            
            {isLoading && feedState.currentPage === 1 ? (
                <div className="content__loading">Loading publications...</div>
            ) : (
                <PublicationList
                    publications={feedPublications}
                    getPublications={refreshPublications}
                    more={feedState.currentPage < feedState.totalPages}
                    loading={isFetching}
                    nextPage={nextPage}
                />
            )}
        </>
    )
}