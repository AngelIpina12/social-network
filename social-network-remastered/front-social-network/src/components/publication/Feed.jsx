import React, { useEffect, useState } from 'react'
import { useLazyFetchUserFeedQuery } from '../../store';
import { PublicationList } from '../publication/PublicationList';

export const Feed = () => {
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [accumulatedPublications, setAccumulatedPublications] = useState([]);
    const [fetchFeed, { data: feedData, error, isLoading }] = useLazyFetchUserFeedQuery();

    // Al montar el componente, se dispara la consulta para la página 1.
    useEffect(() => {
        fetchFeed({ page });
    }, [fetchFeed, page]);

    // Actualizamos las publicaciones acumuladas.
    useEffect(() => {
        if (feedData && feedData.publications) {
            if (page === 1) {
                setAccumulatedPublications(feedData.publications);
            } else {
                setAccumulatedPublications(prev => {
                    const combined = [...prev, ...feedData.publications];
                    const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());
                    return unique;
                });
            }
            setMore(page < feedData.pages);
        }
    }, [feedData, page]);

    // Función para cargar la siguiente página de publicaciones.
    const nextPage = async () => {
        const next = page + 1;
        const nextData = await fetchFeed({ page: next }).unwrap();
        if (nextData && nextData.publications && nextData.publications.length > 0) {
            setPage(next);
            setAccumulatedPublications(prev => {
                const combined = [...prev, ...nextData.publications];
                const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());
                return unique;
            });
        } else {
            setMore(false);
        }
    };


    // Resetear publicaciones.
    const getPublications = () => {
            setPage(1);
            setAccumulatedPublications([]);
            fetchFeed({ page: 1 });
    }

    if (error) {
        return <div>Error al cargar el feed.</div>;
    }

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublications()}>Mostrar nuevas</button>
            </header>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <PublicationList
                    publications={accumulatedPublications}
                    getPublications={getPublications}
                    page={page}
                    setPage={setPage}
                    more={more}
                    setMore={setMore}
                    nextPage={nextPage}
                />
            )}
        </>
    )
}
