import * as supertest from 'supertest';
import * as app from '../server';
import { connect, connection } from 'mongoose';
import { mongodbUri } from '../config/config'

let qId; 

beforeAll(async () => {
  await connect(mongodbUri);
  console.log('Connected to database for testing');
});

afterAll(async () => {
  await connection.close();
});

describe('Testing of question apis', () => {

  it('should get all questions', async () => {
    const response = await supertest(app).get('/api/questions');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should create question', async () => {
    const createResponse = await supertest(app)
      .post('/api/questions')
      .send({
        title: "Test Question A",
        description: "This is test question A.",
        complexity: "Medium",
        category: "Algorithms",
        language: "Other Languages"
      });

      expect(createResponse.status).toBe(200);
      expect(createResponse.body.question.title).toBe("Test Question A");
      expect(createResponse.body.question.description).toBe("This is test question A.");
      expect(createResponse.body.question.complexity).toBe("Medium");
      expect(createResponse.body.question.category).toBe("Algorithms");
      expect(createResponse.body.question.language).toBe("Other Languages");

    qId = createResponse.body.question._id; 
  });

  it('should edit question', async () => {
    const editedQuestion = {
      title: "Test Question B",
      description: "This is test question B.",
      complexity: "Easy",
      category: "String",
      language: "Other Languages"
    };

    const editResponse = await supertest(app)
      .patch(`/api/questions/${qId}`)
      .send(editedQuestion);

    expect(editResponse.status).toBe(200);
    expect(editResponse.body.title).toBe("Test Question B");
    expect(editResponse.body.description).toBe("This is test question B.");
    expect(editResponse.body.complexity).toBe("Easy");
    expect(editResponse.body.category).toBe("String");
    expect(editResponse.body.language).toBe("Other Languages");
  });

  it('should delete question', async () => {
    const deleteResponse = await supertest(app).delete(`/api/questions/${qId}`);
    expect(deleteResponse.status).toBe(200);
  });

});
