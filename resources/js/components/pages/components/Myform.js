import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap-v5';
import { Link } from "react-router-dom";
import { Form } from 'react-bootstrap-v5';

export default function Myform() {
    return (
        <>
            <Container className='mt-2'>

                <Row>
                    <Col sm={8}>

                        <h6>Create Candidate
                           {/* <span className='ms-2'>
                                <Link to='/'>Edit page Layout</Link>

                            </span>*/}

                        </h6>



                    </Col>
                    <Col sm={4}>
                        <Button variant="light" className="cancelbutton" >Cancel</Button>
                        {/*<Button variant="light" className="saveandassociate">Save and Associate</Button>*/}
                        <Button variant="primary" className="Save">Save</Button>

                    </Col>

                </Row>
                <Form className='basicinfo'>
                    <Row>
                        <h4>Basic info</h4>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>First Name</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                            {/* 

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Phone</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="tel"   />

                                    </Form.Group>
                                </Col>

                            </Row>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Website</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text"   />

                                    </Form.Group>
                                </Col>

                            </Row>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Secondary email</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="email"   />

                                    </Form.Group>
                                </Col>

                            </Row> */}

                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Last Name</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="email" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>


                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Email</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="email" />

                                    </Form.Group>
                                </Col>

                            </Row>

                        </Col>


                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Mobile</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="tel" />

                                    </Form.Group>
                                </Col>

                            </Row>

                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Phone</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="tel" />

                                    </Form.Group>
                                </Col>

                            </Row>

                        </Col>






                    </Row>

                    <h4>Adress information</h4>
                    <Row>
                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Street</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>city</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>State/Province</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>


                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>ZIP/PostalCode</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>
                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Country</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                    </Row>

                    <h4>Profesional Details</h4>

                    <Row>
                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Experience in Years</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Highest Qualification Held</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Select aria-label="Default select example">
                                        <option>None</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Current job title</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Select aria-label="Default select example">
                                        <option>None</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Current employer</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Expected salary</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" placeholder='$' />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Current salary</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" placeholder='$' />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>


                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Skill set
                                            <Link to="/" className='ms-2'>clear</Link>
                                        </Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="number" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>


                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Additional info</Form.Label>

                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Skype ID</Form.Label>

                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Twitter</Form.Label>

                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>



                    </Row>

                    <h4>Other info</h4>
                    <Row>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Candidate status</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Select aria-label="Default select example">
                                        <option>New</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Source</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Select aria-label="Default select example">
                                        <option>Added by user</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Col>

                            </Row>


                        </Col>


                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Candidate owner</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Select aria-label="Default select example">
                                        <option>Sandeep swain</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </Form.Select>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>

                                </Col>
                                <Col lg={9}>

                                </Col>

                            </Row>


                        </Col>

                        <Col lg={6}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Email opt out</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col lg={3}>
                                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" />
                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                    </Row>
                    <h4>Education details
                        <Link to="/" className='ms-4'>+Add Education Details</Link>
                    </h4>
                    <Row>
                        <Col lg={7}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Institute/schools</Form.Label>

                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={7}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Major/Department</Form.Label>

                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>

                        <Col lg={7}>

                            <Row>
                                <Col lg={3}>
                                    <Form.Group className="mb-0  mb-lg-3" controlId="formBasicEmail">
                                        <Form.Label>Degree</Form.Label>

                                    </Form.Group>
                                </Col>
                                <Col lg={9}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">

                                        <Form.Control type="text" />

                                    </Form.Group>
                                </Col>

                            </Row>


                        </Col>




                    </Row>


                </Form>
            </Container>
        </>
    )
}
