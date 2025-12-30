const request = require('supertest');
const app = require('../src/index');

describe('Todo API', () => {
  let createdTodoId;

  describe('GET /health', () => {
    it('should return status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const res = await request(app)
        .post('/todos')
        .send({ title: 'Test todo' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test todo');
      expect(res.body.completed).toBe(0);
      createdTodoId = res.body.id;
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/todos')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title is required');
    });
  });

  describe('GET /todos', () => {
    it('should return all todos', async () => {
      const res = await request(app).get('/todos');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a single todo', async () => {
      const res = await request(app).get(`/todos/${createdTodoId}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdTodoId);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app).get('/todos/99999');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update a todo', async () => {
      const res = await request(app)
        .put(`/todos/${createdTodoId}`)
        .send({ completed: 1 });

      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(1);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app)
        .put('/todos/99999')
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      const res = await request(app).delete(`/todos/${createdTodoId}`);
      expect(res.status).toBe(204);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app).delete('/todos/99999');
      expect(res.status).toBe(404);
    });
  });
});
