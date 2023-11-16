const express = require('express');
const router = express.Router();
const controller = require('../controllers/gptController');

router.get('/', (req, res) => {
    res.status(200).send('<h1>GPT Service is up!</h1>');
});

router.post('/generate', controller.getResponse);

router.delete('/exitGpt', controller.exitSession);

router.get('/getCache', controller.getCache);

module.exports = router;