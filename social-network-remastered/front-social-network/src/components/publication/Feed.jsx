import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useLazyFetchUserFeedQuery, useFetchUserFeedQuery } from '../../store';
import { PublicationList } from '../publication/PublicationList';
import { getFeedPublications, setCurrentPage } from '../../store/slices/publicationSlice';

export const Feed = () => {
    const dispatch = useDispatch();
    const feedState = useSelector(state => state.publicationData.feed);
    const feedPublications = useSelector(getFeedPublications);

    // Consulta de RTK Query con los parámetros actualizados
    const { data, error, isLoading, isFetching, refetch } = useFetchUserFeedQuery({
        page: feedState.currentPage
    });

    // Función para cargar más publicaciones
    const nextPage = () => {
        if (feedState.currentPage < feedState.totalPages) {
            dispatch(setCurrentPage({ 
                section: 'feed',
                page: feedState.currentPage + 1 
            }));
        }
    };

    // Función para recargar las publicaciones
    const refreshPublications = () => {
        dispatch(setCurrentPage({ section: 'feed', page: 1 }));
        refetch();
    };

    if (error) {
        return <div>Error al cargar el feed.</div>;
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
                    {isFetching ? 'Cargando...' : 'Mostrar nuevas'}
                </button>
            </header>
            {isLoading && feedState.currentPage === 1 ? (
                <div className="content__loading">Cargando publicaciones...</div>
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
