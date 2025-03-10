import React, { useEffect, useState } from 'react'
import { useLazyFetchUserFeedQuery } from '../../store';
import { PublicationList } from '../publication/PublicationList';

export const Feed = () => {
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [accumulatedPublications, setAccumulatedPublications] = useState([]);
    const [fetchFeed, { data: feedData, error, isLoading }] = useLazyFetchUserFeedQuery();
    console.log(feedData)

    // Al montar el componente, se dispara la consulta para la página 1.
    useEffect(() => {
        fetchFeed({ page });
    }, [fetchFeed, page]);

    // Cada vez que se actualice feedData, actualizamos las publicaciones acumuladas.
    useEffect(() => {
        if (feedData && feedData.publications) {
            if (page === 1) {
                // Si es la página 1, reemplazamos las publicaciones acumuladas.
                setAccumulatedPublications(feedData.publications);
            } else {
                // Para páginas >1, concatenamos sin duplicados.
                setAccumulatedPublications(prev => {
                    const combined = [...prev, ...feedData.publications];
                    // Filtramos duplicados basándonos en el _id.
                    const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());
                    return unique;
                });
            }
            console.log(page)
        }
    }, [feedData, page]);

    // Función para cargar la siguiente página de publicaciones.
    const nextPage = async () => {
        const next = page + 1;
        // Disparamos la consulta para la página siguiente
        const nextData = await fetchFeed({ page: next }).unwrap();
        // Si la consulta retorna publicaciones, las concatenamos y actualizamos la página.
        if (nextData && nextData.publications && nextData.publications.length > 0) {
            setPage(next);
            setAccumulatedPublications(prev => {
                const combined = [...prev, ...nextData.publications];
                const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());
                return unique;
            });
        } else {
            // Si no se obtuvieron publicaciones, significa que ya no hay más.
            setMore(false);
        }
    };


    // Cambiar la página y recargar publicaciones.
    // Si se quiere mostrar "nuevas" publicaciones, se reinicia la página a 1.
    const getPublications = (nextPage = 1, showNews = false) => {
        if (showNews) {
            setPage(1);
            fetchFeed({ page: 1 });
        };
    }

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
