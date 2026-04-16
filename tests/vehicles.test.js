jest.mock('../db'); 
jest.mock('../middleware/auth', () => ({
  verifyToken: (req, res, next) => {
    req.user = { id: 1, role: 'admin' };
    next();
  }
}));

const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Vehicles API endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/vehicles - should return all vehicles', async () => {
    const mockVehicles = [
      { vehicle_id: 1, brand: 'Toyota', model: 'Corolla' },
      { vehicle_id: 2, brand: 'Honda', model: 'Civic' }
    ];
    db.query.mockResolvedValue([mockVehicles]);

    const res = await request(app).get('/api/vehicles');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockVehicles);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM vehicles');
  });

  it('GET /api/vehicles/:id - should return specific vehicle', async () => {
    const mockVehicle = { vehicle_id: 1, brand: 'Toyota', model: 'Corolla' };
    db.query.mockResolvedValue([[mockVehicle]]);

    const res = await request(app).get('/api/vehicles/1');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockVehicle);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM vehicles WHERE vehicle_id = ?', ['1']);
  });

  it('GET /api/vehicles/:id - should return 404 if not found', async () => {
    db.query.mockResolvedValue([[]]); 

    const res = await request(app).get('/api/vehicles/999');
    
    expect(res.statusCode).toEqual(404);
  });

  it('POST /api/vehicles - should create vehicle', async () => {
    db.query.mockResolvedValue([{ insertId: 3 }]);

    const newVehicle = {
      created_at: '2023-10-10',
      next_technical_exam: '2025-10-10',
      year: '2023',
      model: 'Octavia',
      brand: 'Skoda',
      vin: '12345678901234567',
      start_odometer: 1000,
      insurance_expiry: '2024-10-10',
      lisence_plate: 'ABC-123'
    };

    const res = await request(app)
      .post('/api/vehicles')
      .send(newVehicle);
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.id).toEqual(3);
    expect(db.query).toHaveBeenCalled();
  });

  it('PUT /api/vehicles/:id - should update vehicle', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const updateVehicle = {
      created_at: '2023-10-10',
      next_technical_exam: '2025-10-10',
      year: '2023',
      model: 'Octavia',
      brand: 'Skoda',
      vin: '12345678901234567',
      start_odometer: 2000,
      insurance_expiry: '2024-10-10',
      lisence_plate: 'ABC-123'
    };

    const res = await request(app)
      .put('/api/vehicles/1')
      .send(updateVehicle);
      
    expect(res.statusCode).toEqual(200);
    expect(db.query).toHaveBeenCalled();
  });

  it('DELETE /api/vehicles/:id - should delete vehicle', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);

    const res = await request(app).delete('/api/vehicles/1');
    
    expect(res.statusCode).toEqual(200);
    expect(db.query).toHaveBeenCalledWith('DELETE FROM vehicles WHERE vehicle_id = ?', ['1']);
  });
});
