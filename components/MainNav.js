import { Nav, Navbar, Form, Button, Row, Col, NavDropdown, Container } from "react-bootstrap";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";

import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/my-app/store';

import { addToHistory } from "@/my-app/lib/userData";
import { removeToken, readToken } from "@/my-app/lib/authenticate";

export default function MainNav() {

  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleNavLinkClick = () => setIsExpanded(false);
  
  const token = readToken();

  const router = useRouter();
  
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      search: '', 
    },
  });

  async function submitForm(data, e) {
    let queryString = `title=true&q=${data.search}`;
    e.preventDefault();
    setIsExpanded(false);
    setSearchHistory(await addToHistory(queryString));
    router.push('/artwork?'+ queryString);
  }

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push('/login');
  }

  return (
    <>
      <Navbar expand="lg" expanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} className="fixed-top navbar-dark bg-dark justify-content-around ">
        <div className="d-flex">
          <Navbar.Brand className="ms-4">Farbod Moayeri</Navbar.Brand>
          <Nav className="me-auto">
            <Link href="/" passHref legacyBehavior><Nav.Link active={router.pathname === "/"} onClick={handleNavLinkClick}>Home</Nav.Link></Link>
            <Link href="/search" passHref legacyBehavior><Nav.Link active={router.pathname === "/search"} onClick={handleNavLinkClick}>Advanced Search</Nav.Link></Link>
          </Nav>
        </div>
        
        <div className="d-flex">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto d-flex align-items-center">
              &nbsp;
              <Form onSubmit={handleSubmit(submitForm)} className="d-flex">
                  <Row>
                      <Col xs="auto p-0">
                          <Form.Control
                              type="text"
                              placeholder="Search"
                              className="mr-sm-2"
                              {...register('search')}
                          />
                      </Col>
                      <Col xs="auto">
                          <Button type="submit">Search</Button>
                      </Col>
                  </Row>
              </Form>
              &nbsp;
              {token &&
                <NavDropdown title={token.userName} id="collapsible-nav-dropdown">
                  <Link href="/favourites" passHref legacyBehavior><NavDropdown.Item>Favourites</NavDropdown.Item></Link>
                  <Link href="/history" passHref legacyBehavior><NavDropdown.Item>Search History</NavDropdown.Item></Link>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              }
              {!token &&
                <Nav>
                  <Link href="/register" passHref legacyBehavior><Nav.Link active={router.pathname === "/register"} onClick={handleNavLinkClick}>Register</Nav.Link></Link>
                  <Link href="/login" passHref legacyBehavior><Nav.Link active={router.pathname === "/login"} onClick={handleNavLinkClick}>Login</Nav.Link></Link>
                </Nav>
              }
            </Nav>
          </Navbar.Collapse>
        </div>
            
        </Navbar>

        <br />
        <br />
        <br />
    </>
  );
}