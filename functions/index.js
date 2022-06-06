import functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { secretJWT } from './secret.js';

const users = [
	{
		id: 1,
		email: 'jenna@gmail.com',
		password: 'myjenna05',
	},
	{
		id: 2,
		email: 'bryan@gmail.com',
		password: 'ilikeskating09',
	},
	{
		id: 3,
		email: 'luke@gmail.com',
		password: 'mayforce2010',
	},
];

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
	const { email, password } = req.body;
	// User email and password must match
	let user = users.find(
		user => user.email === email && user.password == password
	);

	// Throw error message for invalid credentials
	if (!user) {
		res.status(401).send('Invalid email or password');
		return;
	}
	// Password field has not been defined
	user.password = undefined;
	// Send login information
	const token = jwt.sign(user, secretJWT, { expiresIn: '1d' });
	res.send(token);
	// console.log(users[0].user.email);
});

app.get('/public', (req, res) => {
	res.send('Welcome');
});

app.get('/private', (req, res) => {
	const token = req.headers.authorization || '';
	if (!token) {
		res.status(401).send('You must be logged in to see this.');
		return;
	}
	jwt.verify(token, secretJWT, (err, decoded) => {
		if (err) {
			res.status(401).send('You must be logged in to see this.');
			return;
		}
		res.send(`Your email, ${decoded.email} has been verified.`);
	});
});

app.listen(5050, () => {
	console.log('Express running...');
});

export const myApi = functions.https.onRequest(app);
