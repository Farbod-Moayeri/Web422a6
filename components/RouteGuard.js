import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { useAtom } from 'jotai';
import { favouritesAtom } from '@/my-app/store';
import { searchHistoryAtom } from '@/my-app/store';

import { getFavourites, getHistory } from '@/my-app/lib/userData';
import { isAuthenticated } from '@/my-app/lib/authenticate';

const PUBLIC_PATHS = ['/login', '/', '/_error', '/register'];

export default function RouteGuard(props) {
    
    const [authorized, setAuthorized] = useState(false);
    
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const router = useRouter();

    useEffect(() => {
        updateAtoms();
        // on initial load - run auth check
        authCheck(router.pathname);

        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck);

        // unsubscribe from events in useEffect return function
        return () => {
        router.events.off('routeChangeComplete', authCheck);
        };
    }, []);

    function authCheck(url) {
        // redirect to login page if accessing a private page and not logged in
        const path = url.split('?')[0];
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
          setAuthorized(false);
          router.push('/login');
        } else {
          setAuthorized(true);
        }
      }

    async function updateAtoms() {
        setFavouritesList(await getFavourites());
        setSearchHistory(await getHistory());
    }

    return <>{authorized && props.children}</>
}