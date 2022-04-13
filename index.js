import express from 'express';
import dotenv from 'dotenv';
import mysql2 from 'mysql2/promise';

dotenv.config();

const connection = await mysql2.createConnection(process.env.DATABASE_URL);
const app = express();

app.get('/', (req, res) => {
	res.json({ msg: 'Hello, world' });
});

app.get('/characters', async (req, res) => {
	let status = 200;
	let retVal = {};
	try {
		const query = 'SELECT * FROM hp_character';
		const [rows] = await connection.query(query);
		retVal.data = rows;
	} catch (err) {
		console.log(err);
		status = 500;
		retVal.message = err;
	} finally {
		res.status(status).json(retVal);
	}
});

app.get('/character/:id', async (req, res) => {
	const { id } = req.params;
	let status = 200;
	let retVal = {};
	if (isNaN(Number(id))) {
		status = 400;
		retVal.message = 'Invalid request, id must be a number';
	}
	try {
		//to prevent SQL injection attacks
		const query = `SELECT * FROM hp_character WHERE hp_character.id=?`;
		const [rows] = await connection.query(query, [id]);
		if (!rows[0]) {
			return res.json({ error: `Couldn't find that character with id${id}` });
		}
		retVal.data = rows[0];
	} catch {
		console.error(err);
		retVal.message = err;
		status = 500;
	} finally {
		res.status(status).json(retVal);
	}
});

app.get('/wands', async (req, res) => {
	let status = 200;
	let retVal = {};
	try {
		const query = 'SELECT * FROM wand';
		const [rows] = await connection.query(query);
		retVal.data = rows;
	} catch (err) {
		console.log(err);
		status = 500;
		retVal.message = err;
	} finally {
		res.status(status).json(retVal);
	}
});

app.get('/wand/:id', async (req, res) => {
	const { id } = req.params;
	let status = 200;
	let retVal = {};
	if (isNaN(Number(id))) {
		status = 400;
		retVal.message = 'Invalid request, id must be a number';
	}

	try {
		//to prevent SQL injection attacks
		const query = `SELECT * FROM wand WHERE wand.id=?`;
		const [rows] = await connection.query(query, [id]);
		if (!rows[0]) {
            return res.json({ error: "Couldn't find that wand" });
		}
        retVal.data = rows;
	} catch {
		console.log(err);
		status = 500;
		retVal.message = err;
	} finally {
		res.status(status).json(retVal);
	}
});
const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log('App listening on port', port);
});
