import { Card, ListGroup, Button } from "react-bootstrap";
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/my-app/store';
import { useRouter } from "next/router";
import styles from '@/styles/History.module.css';

import { removeFromHistory } from "@/my-app/lib/userData";

const PER_PAGE = 12;

export default function History() {

    const router = useRouter();

    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    if(!searchHistory) return null;

    let parsedHistory = [];

    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    const historyClicked = (e, index) => {
        router.push(`/artwork?${searchHistory[index]}`)
    }

    const removeHistoryClicked = async (e, index) => {
        e.stopPropagation(); 
        setSearchHistory(await removeFromHistory(searchHistory[index]));
    }


    if (parsedHistory.length === 0) {
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
        <ListGroup>
            {parsedHistory.map((historyItem, index) => (
                <ListGroup.Item
                    className={styles.historyListItem}
                    key={index} 
                    onClick={(e) => historyClicked(e, index)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div className="d-flex">
                            {Object.entries(historyItem).map(([key, value], idx) => (
                                <div key={idx} style={{ marginRight: '10px' }}>
                                {key}: <strong>{value}</strong>
                                </div>
                            ))}
                        </div>
                        

                        <Button className="float-end" variant="danger" size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeHistoryClicked(e, index);
                                }}>&times;
                        </Button>
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );

  
}
