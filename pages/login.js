import { Card, Form, Button, Alert } from "react-bootstrap";

import { useState } from 'react';
import { authenticateUser } from "@/my-app/lib/authenticate";
import { getFavourites, getHistory } from "@/my-app/lib/userData";
import { useRouter } from "next/router";

import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/my-app/store';
import { favouritesAtom } from '@/my-app/store';

export default function Login(props){
    const router = useRouter();
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState('');

    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await authenticateUser(user, password);
            await updateAtoms();
            router.push('/favourites');
        } catch (err) {
            setWarning(err.message);
        }
    }

    async function updateAtoms() {
        setFavouritesList(await getFavourites()); 
        setSearchHistory(await getHistory()); 
    }

    return (
        <>
        <Card bg="light">
            <Card.Body><h2>Login</h2>Enter your login information below:</Card.Body>
        </Card>
        <br />
        <Form onSubmit={handleSubmit}>
            <Form.Group>
            <Form.Label>User:</Form.Label><Form.Control type="text" value={user} id="userName" name="userName" onChange={e => setUser(e.target.value)} />
            </Form.Group>
            <br />
            <Form.Group>
            <Form.Label>Password:</Form.Label><Form.Control type="password" value={password} id="password" name="password" onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <br />
            { warning && ( <><br /><Alert variant="danger">{warning}</Alert></> )}
            <br />
            <Button variant="primary" className="pull-right" type="submit">Login</Button>
        </Form>
        </>
    );
}