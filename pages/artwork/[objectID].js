import { useRouter } from "next/router";
import { Row, Col } from "react-bootstrap";
import ArtworkCardDetail from "@/components/ArtWorkCardDetail"


export default function ArtWorkById() {
    const router = useRouter();
   
    const { objectID } = router.query;
    
    if (objectID) {
        return (
            <>
              <Row>
                  <Col>
                      <ArtworkCardDetail objectID={objectID} />
                  </Col>
              </Row>
            </>
        );
    } else {
        return null;
    }
    
  }
