import Error from 'next/error';
import Link from 'next/link';
import { Card, Button } from 'react-bootstrap';
import useSWR from 'swr';
import styles from '@/styles/ArtWorkCard.module.css'; 

export default function ArtWorkCard({ objectID }) {
  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);

  if (error) {
    return <Error statusCode={404} />;
  } else if (data === null) {
    return null;
  }

  const buttonHref = `/artwork/${objectID}`;
  return (
    <>
      <Card className={styles['artwork-card']}>
        <Card.Img
          onError={(event) => {
            event.target.onerror = null;
            event.target.src = "https://placehold.co/600x400?text=Photo+Not+Available";
          }}
          className={styles['card-img-custom']}
          src={data?.primaryImageSmall}
          alt="Listing Image"
        />
        <Card.Body className={styles['card-body-custom']}>
          <Card.Title className={styles['text-truncate']}>{data?.title || "N/A"}</Card.Title>
          <Card.Text>
            <div className={styles['text-truncate']}><strong>Date:</strong> {data?.objectDate || "N/A"}</div>
            <div className={styles['text-truncate']}><strong>Classification:</strong> {data?.classification || "N/A"}</div>
            <div className={styles['text-truncate']}><strong>Medium:</strong> {data?.medium || "N/A"}</div>
          </Card.Text>
          <Link passHref href={buttonHref}><Button variant="primary">View Details</Button></Link>
        </Card.Body>
      </Card>
    </>
  );
}
