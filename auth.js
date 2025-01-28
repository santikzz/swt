const crypto = require('crypto');
const { valkeyClient } = require('./valkey');
const { pgClient } = require('./postgres');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const fingerprintHeader = req.headers.fingerprint;
        if (!fingerprintHeader) {
            return res.status(400).json({ error: 'Missing fingerprint header' });
        }

        const userQuery = 'SELECT id, username, password FROM users WHERE username = $1';
        const userResult = await pgClient.query(userQuery, [username]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (userResult.rows[0].password !== hashedPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = crypto.createHash('sha256').update(crypto.randomUUID()).digest('hex');
        const expirationTime = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours from now

        const tokenData = {
            token: token,
            id: userResult.rows[0].id,
            username: userResult.rows[0].username,
            expires: expirationTime,
            fingerprint: fingerprintHeader
        };

        await valkeyClient.set(token, JSON.stringify(tokenData), 'EX', 24 * 60 * 60);  // 24 hours
        return res.status(200).json({ message: 'Logged in successfully', token: token });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const register = async (req, res) => {
    try {
        const fingerprintHeader = req.headers.fingerprint;
        if (!fingerprintHeader) {
            return res.status(400).json({ error: 'Missing fingerprint header' });
        }

        const { username, password } = req.body;
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';

        await pgClient.query(query, [username, hashedPassword]);
        return res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error creating user' });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.session.token;
        const result = await valkeyClient.del(token);

        if (result) {
            return res.status(200).json({ message: 'Logged out successfully' });
        } else {
            return res.status(400).json({ error: 'Error logging out' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Error logging out' });
    }
};

module.exports = { login, register, logout };