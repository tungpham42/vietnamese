import React, { useState } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import words from "./data/words";

const App = () => {
  // State to hold the search term and the matched words
  const [searchTerm, setSearchTerm] = useState("");
  const [matchedWords, setMatchedWords] = useState([]);

  // Function to filter and return words that match the exact characters and number of characters as the search term
  const filterByExactMatchAndLength = (word, searchTerm) => {
    const sanitizedWord = word.word.replace(/\s+/g, ""); // Remove spaces from word
    const sanitizedSearchTerm = searchTerm.replace(/\s+/g, ""); // Remove spaces from the search term
    return (
      sanitizedWord === sanitizedSearchTerm &&
      word.word.length === searchTerm.length
    ); // Exact character match and same length
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Find all the words in the words array that exactly match the search term (including character length and spaces)
    const results = words
      .filter((word) => filterByExactMatchAndLength(word, value)) // Only return words that match both character and length
      .map((word) => {
        // Calculate the match score based on how many search terms match the word
        const matchScore = value
          .trim()
          .split(/\s+/)
          .reduce(
            (score, term) =>
              word.word.toLowerCase().includes(term.toLowerCase())
                ? score + 1
                : score,
            0
          );
        return { ...word, matchScore };
      })
      .sort((a, b) => b.matchScore - a.matchScore); // Sort words with the highest match score first

    setMatchedWords(results); // Store matched words in state
  };

  return (
    <Container className="col-md-6">
      <Row className="my-4">
        <Col md={12}>
          <h1>Tra từ tiếng Việt</h1>
          <Form>
            <Form.Group controlId="searchInput">
              <Form.Label>Tra từ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Điền từ"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Form>

          {matchedWords.length > 0
            ? matchedWords.map((foundWord, index) => (
                <Card className="mt-4" key={index}>
                  <Card.Header>
                    <h5>{foundWord.word}</h5>
                    <p className="text-muted">{foundWord.part_of_speech}</p>
                  </Card.Header>
                  <Card.Body>
                    <Card.Title>Định nghĩa</Card.Title>
                    <Card.Text>{foundWord.meaning}</Card.Text>
                    <Card.Title>Ví dụ</Card.Title>
                    <Card.Text>{foundWord.example}</Card.Text>
                  </Card.Body>
                </Card>
              ))
            : searchTerm && <p>Không có kết quả cho từ khóa "{searchTerm}"</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
