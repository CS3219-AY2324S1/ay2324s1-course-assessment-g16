const gptService = require('../services/gptService');

async function getResponse(req, res, next) {
    try {
        const userId = req.body.userId;

        const prompt = req.body.prompt;
        
        console.log(`Received prompt: ${prompt}`);

        const response = await gptService.getResponse(userId, prompt);

        switch (response.status) {
            case 'success':
                await res.status(200).json(response);
                break;
            case 'error':
                await res.status(500).json(response);
                break;
            default:
                await res.status(500).json({ message: 'Unknown error. Please try again!' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get response from gpt. Please try again!' })
    }
};

async function exitSession(req, res, next) {
    try {
        const userId = req.body.userId;

        const response = gptService.exitSession(userId);

        if (response) {
            await res.status(200).json({ status: 'success' });

        } else {
            await res.status(500).json({ status: 'error', message: 'Failed to exit session.' });
        }

    } catch (error) {
        console.log(error);
        
        await res.status(500).json({ status: 'error', message: 'Failed to get response from gpt. Please try again!' })
    }
}

async function getCache(req, res, next) {
    try {
        const userId = req.body.userId;

        const response = gptService.getCache(userId);

        if (response.status === 'success') {
            await res.status(200).json(response);

        } else {
            await res.status(500).json(response);
        }

    } catch (error) {
        console.log(error);

        await res.status(500).json({ status: 'error', message: error })
    }
}

module.exports = {
    getResponse,
    exitSession,
    getCache
};