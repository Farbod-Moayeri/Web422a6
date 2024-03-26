import ArtWorkCard from "@/components/ArtWorkCard";
import { Row, Card, Col, Pagination } from "react-bootstrap";
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/my-app/store';

const PER_PAGE = 12;

export default function Favourites() {

  const [favouritesList, ] = useAtom(favouritesAtom);

  if(!favouritesList) return null;
  
  if (favouritesList.length === 0) {
    return (
      <Card style={{ width: '18rem', margin: '0 auto', marginTop: '20px' }}>
        <Card.Body>
          <Card.Title>Nothing Here</Card.Title>
          <Card.Text>
            Try adding some new artwork to the list.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Row className="gy-4" style={{ marginTop: '20px' }}>
      {favouritesList.map(objectID => (
        <Col lg={3} key={objectID}>
          <ArtWorkCard objectID={objectID} />
        </Col>
      ))}
    </Row>
  );

  
}
