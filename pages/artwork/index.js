import { useRouter } from "next/router";
import Error from "next/error";
import ArtWorkCard from "@/components/ArtWorkCard";
import { useEffect, useState } from "react";
import { Row, Card, Col, Pagination } from "react-bootstrap";
import useSWR from "swr";
import validObjectIDList from '@/public/data/validObjectIDList.json'

const PER_PAGE = 12;

export default function Artwork() {

  

  const [page, setPage] = useState(1);
  const [artworkList, setArtworkList] = useState(null);

  const router = useRouter();
  let finalQuery = router.asPath.split('?')[1];
  
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

  const previousPage = () => {
    if (page > 1) {
      setPage(page-1);
    }
  }

  const nextPage = () => {
    if (page < artworkList.length) {
      setPage(page+1)
    }
  }

  useEffect(() => {
    if (data != null) {
      var results = [];
      let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));

      for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
        const chunk = filteredResults.slice(i, i + PER_PAGE);
        results.push(chunk);
      }

      setArtworkList(results);
      setPage(1);
    }
  }, [data])

  if(error) {
    return(<Error statusCode={404} />)
  } else if (artworkList !== null) {
    return(<>
      <Row className="gy-4">
        {artworkList.length > 0 &&
          artworkList[page - 1]?.map(objectID => (
            <Col lg={3} key={objectID}><ArtWorkCard objectID={objectID} /></Col>
          ))
        }  
        {artworkList.length === 0 &&
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Nothing Here</Card.Title>
              <Card.Text>
                Try searching for something else.
              </Card.Text>
            </Card.Body>
          </Card>
        }
      </Row>
      <br />
      {artworkList.length > 0 &&
        <Row>
          <Col>
          <Pagination>
            <Pagination.Prev onClick={previousPage} disabled={page === 1} />
            <Pagination.Item active >{page}</Pagination.Item>
            <Pagination.Next onClick={nextPage}/>
          </Pagination>
          </Col>
        </Row>
      }
    </>)
  } else if (artworkList === null || artworkList === undefined) {
    return null;
  }

  
}
