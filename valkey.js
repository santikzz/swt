const ValKey = require('iovalkey');

const valkeyClient = new ValKey({
    host: 'localhost',
    port: 6379,
    password: 'password!123',
});

valkeyClient.on('connect', () => {
    console.log('Connected to ValKey');
});

valkeyClient.on('error', (err) => {
    console.error('Valkey error:', err);
});

module.exports = { valkeyClient };