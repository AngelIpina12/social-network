import React, { useEffect, useState } from 'react'
import { useFetchUserFeedQuery } from '../../store';
import { PublicationList } from '../publication/PublicationList';

export const Feed = () => {
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const { data: feedData, error, isLoading, refetch } = useFetchUserFeedQuery({ page });
    const publications = feedData ? feedData.publications : [];

    // Actualiza el estado 'more' según el total de páginas
    useEffect(() => {
        if (feedData && feedData.totalPages) {
            setMore(page < feedData.totalPages);
        }
    }, [feedData, page]);

    // Cambiar la página y recargar publicaciones.
    // Si se quiere mostrar "nuevas" publicaciones, se reinicia la página a 1.
    const getPublications = (nextPage = 1, showNews = false) => {
        if (showNews) {
            setPage(1);
            refetch();
        } else {
            setPage(nextPage);
        }
    };

    if (error) {
        return <div>Error al cargar el feed.</div>;
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublications(1, true)}>Mostrar nuevas</button>
            </header>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <PublicationList
                    publications={publications}
                    getPublications={getPublications}
                    page={page}
                    setPage={setPage}
                    more={more}
                    setMore={setMore}
                />
            )}
        </>
    )
}
