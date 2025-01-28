const express = require('express');
const { login, register, logout } = require('./auth');
const { middleware } = require('./middleware');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/login', login);
app.post('/register', register);
app.post('/logout', middleware, logout);

app.get('/protected', middleware, async (req, res) => {
    return res.status(200).json({ message: `Hello ${req.session.username} from protected route!, your user_id is ${req.session.id}` });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
