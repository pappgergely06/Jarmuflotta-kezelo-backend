const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const vehiclesRoutes = require('./routes/vehicles');
const driversRoutes = require('./routes/drivers');
const driverAssignmentsRoutes = require('./routes/driver_assignments');
const travelDocumentsRoutes = require('./routes/travel_documents');
const fuelingsRoutes = require('./routes/fuelings');
const servicesRoutes = require('./routes/services');
const servicesListRoutes = require('./routes/services_list');
const usersRoutes = require('./routes/users');

const app = express();

BigInt.prototype.toJSON = function() {
    return this.toString();
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/driver-assignments', driverAssignmentsRoutes);
app.use('/api/travel-logs', travelDocumentsRoutes);
app.use('/api/fuelings', fuelingsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/services-list', servicesListRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;
