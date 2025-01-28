const { valkeyClient } = require('./valkey');

const middleware = async (req, res, next) => {
    try {
        const tokenHeader = req.headers.authorization?.split(' ')[1];
        if (!tokenHeader) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        const fingerprintHeader = req.headers.fingerprint;
        if (!fingerprintHeader) {
            return res.status(400).json({ error: 'Missing fingerprint header' });
        }

        const tokenData = await valkeyClient.get(tokenHeader);
        if (!tokenData) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        const { token, id, username, expires, fingerprint } = JSON.parse(tokenData);

        if (fingerprint !== fingerprintHeader) {
            return res.status(401).json({ message: 'Unauthorized: Fingerprint mismatch' });
        }

        if (expires < Math.floor(Date.now() / 1000)) {
            await valkeyClient.del(token);
            return res.status(401).json({ message: 'Unauthorized: Token expired' });
        }

        req.session = { token, id, username, expires };
        next();

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { middleware };