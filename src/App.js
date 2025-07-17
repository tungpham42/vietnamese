import React, { useState } from "react";
import { Container, Row, Col, Form, Card, InputGroup } from "react-bootstrap";
import words from "./data/words";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [matchedWords, setMatchedWords] = useState([]);

  const filterByExactMatchAndLength = (word, searchTerm) => {
    const sanitizedWord = word.word.replace(/\s+/g, "");
    const sanitizedSearchTerm = searchTerm.replace(/\s+/g, "");
    return (
      sanitizedWord === sanitizedSearchTerm &&
      word.word.length === searchTerm.length
    );
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const results = words
      .filter((word) => filterByExactMatchAndLength(word, value))
      .map((word) => {
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
      .sort((a, b) => b.matchScore - a.matchScore);

    setMatchedWords(results);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="text-center mb-4">
            <h1 className="fw-bold">
              🔎 Từ điển <span className="text-gradient">Tiếng Việt</span>
            </h1>
            <p className="text-muted fst-italic">
              Tra cứu định nghĩa và ví dụ minh họa một cách dễ dàng
            </p>
          </div>

          <Form>
            <InputGroup className="mb-4">
              <InputGroup.Text className="bg-primary text-white">
                🔍
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Nhập từ cần tra..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="rounded-start"
              />
            </InputGroup>
          </Form>

          {matchedWords.length > 0 ? (
            matchedWords.map((foundWord, index) => (
              <Card className="mb-4 shadow-sm border-0" key={index}>
                <Card.Header className="bg-light">
                  <h5 className="mb-0 text-primary">{foundWord.word}</h5>
                  <span className="badge bg-info text-dark ms-2">
                    {foundWord.part_of_speech}
                  </span>
                </Card.Header>
                <Card.Body>
                  <Card.Title className="mb-2">📘 Định nghĩa</Card.Title>
                  <Card.Text>{foundWord.meaning}</Card.Text>
                  <Card.Title className="mb-2">💡 Ví dụ</Card.Title>
                  <Card.Text className="fst-italic">
                    {foundWord.example}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : searchTerm ? (
            <div className="alert alert-warning text-center">
              Không có kết quả cho từ khóa "<strong>{searchTerm}</strong>"
            </div>
          ) : null}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
