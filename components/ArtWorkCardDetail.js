import Error from 'next/error';
import { Card, Button } from 'react-bootstrap';
import useSWR from 'swr';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/my-app/store';
import { useState, useEffect } from 'react';

import { addToFavourites, removeFromFavourites } from '@/my-app/lib/userData';

export default function ArtWorkCardDetail({objectID}) {


  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);

  const [favouritesList, setFavouritesList ] = useAtom(favouritesAtom);

  const [showAdded, setShowAdded] = useState(false);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList])

  const favouritesClicked = async () => {
    if(showAdded) {
      setFavouritesList(await removeFromFavourites(objectID));
      setShowAdded(false);
    } else {
      setFavouritesList(await addToFavourites(objectID));
      setShowAdded(true);
    }
  }

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  return (
    <>
      <Card >
        {data?.primaryImage &&
          <Card.Img  onError={(event) => {
            event.target.onerror = null; 
            event.target.src =
            "https://placehold.co/600x400?text=Photo+Not+Available";
          }}
          className=" "
          src={data?.primaryImageSmall}
          alt="Listing Image"
          />
        }
        <Card.Body>
          <Card.Title>{data?.title || "N/A"}</Card.Title>
          <Card.Text>
          <strong>Date:</strong> {data?.objectDate || "N/A"}
          <br/>
          <strong>Classification:</strong> {data?.classification || "N/A"}
          <br/>
          <strong>Medium:</strong> {data?.medium || "N/A"}
          <br/>
          <br/>
          <strong>Artist:</strong> {data?.artistDisplayName || "N/A"} ( {data?.artistDisplayName && <a href={data?.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a>} )
          <br/>
          <strong>Credit Line:</strong> {data?.creditLine || "N/A"}
          <br/>
          <strong>Dimensions:</strong> {data?.dimensions}
          <br/>
          <br/>
          <Button variant={showAdded ? 'primary' : 'outline-primary'} onClick={favouritesClicked}>{showAdded ? "+ Favourite (added)" : "+ Favourite"}</Button>
          </Card.Text>
            
        </Card.Body>
      </Card>
    </>
  );
  

  
}
