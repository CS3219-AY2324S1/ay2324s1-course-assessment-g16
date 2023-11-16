const { createServer } = require("node:http");
const { Server } = require("socket.io");
const ioc = require('socket.io-client');
const config = require('../config/config');
const { startCollaboration } = require('../services/collaborationService');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const MatchedPair = require('./collabTestSchema');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

jest.setTimeout(20000);

describe('Collaboration Service', () => {
    let io, user1, user2, mongod, port;

    const mockMatch = {
        sessionId: "123c44c9-9bc3-402f-ba56-689eb0d2774d",
        id1: "Gc2Bz9Nl8Wx4",
        id2: "PxJ3lVtWz8Kq",
        isEnded: false,
        questionId: new mongoose.Types.ObjectId("65378371752185e6e1b5b342"),
        language: "Java",
        proficiency: "None",
        difficulty: "Easy",
        topic: "Arrays",
    };

    const sessionId = "123c44c9-9bc3-402f-ba56-689eb0d2774d";

    beforeAll(async() => {
        mongod = await MongoMemoryServer.create();
        const mongoUri = mongod.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("testDB connected");

        await MatchedPair(mockMatch).save();

        const mock = new MockAdapter(axios);

        mock.onGet(`${config.matchingServiceUrl}/getMatchSession/Gc2Bz9Nl8Wx4`)
            .reply(200, {
                sessionId: "123c44c9-9bc3-402f-ba56-689eb0d2774d"
            });

        mock.onGet(`${config.matchingServiceUrl}/getMatchSession/PxJ3lVtWz8Kq`)
            .reply(200, {
                sessionId: "123c44c9-9bc3-402f-ba56-689eb0d2774d"
            });

        mock.onGet(`${config.matchingServiceUrl}/getSession/123c44c9-9bc3-402f-ba56-689eb0d2774d`)
            .reply(200, {
                sessionId: "123c44c9-9bc3-402f-ba56-689eb0d2774d",
                session: mockMatch
            });

        mock.onDelete(`${config.matchingServiceUrl}/end/123c44c9-9bc3-402f-ba56-689eb0d2774d`)
            .reply(200, {status: "success"});

        const httpServer = createServer();
        io = new Server(httpServer);
        const serverReadyPromise = new Promise((resolve) => {
            httpServer.listen(() => {
              console.log('Server is running');
              io.on("connection", async(socket) => {
                console.log("socket connected: ", socket.id);
                await startCollaboration(socket, io);
                });
              resolve();
            });
        });

        await serverReadyPromise;

        port = httpServer.address().port;

    });
    
    beforeEach(async() => {

        user1 = ioc(`http://localhost:${port}`, {
            query: {
                userId: 'Gc2Bz9Nl8Wx4',
                sessionId: sessionId
            }
        });

        user2 = ioc(`http://localhost:${port}`, {
            query: {
                userId: 'PxJ3lVtWz8Kq',
                sessionId: sessionId
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 5000));

    });
    
    afterEach(async() => {
        await user1.disconnect();
        await user2.disconnect();
    });
    
    test('code change should be detected and broadcasted to all users in the same room', async() => {
        await user1.emit('update-code', 1, 'console.log("hello world");');

        user2.on('code-changed', (line, code) => {
            expect(line).toBe(1);
            expect(code).toBe('console.log("hello world");');
            console.log("1 ", line, code);
        });

        await user2.emit('update-code', 2, 'console.log("bye world");');

        user1.on('code-changed', (line, code) => {
            expect(line).toBe(2);
            expect(code).toBe('console.log("bye world");');
            console.log("1 ", line, code);
        });
        
    });
    
    test('time extension should be successful when time is sufficient', async() => {
        await user1.emit('extend-time');

        user1.on('time-extended', (init, length) => {
            expect(length).toBe(config.DEFAULT_TIME_LIMIT.Easy + config.EXTENSION_TIME);
            console.log("2 ", length);
        });

        user2.on('time-extended', (init, length) => {
            expect(length).toBe(config.DEFAULT_TIME_LIMIT.Easy + config.EXTENSION_TIME);
            console.log("2 ", length);
        });
    });

    test('code editor should be cleared after the cleaning request', async() => {
        await user1.emit('clear');

        user2.on('cleared', (recvSessionId) => {
            expect(recvSessionId).toBe(sessionId);
            console.log("3 ", recvSessionId);
        });
    });

    test('user\'s reconnection could be received by collaborator', async() => {
        await user1.emit('clear');
        await user1.emit('reconnect');

        user1.on('success-reconnected', (collaborativeInput) => {
            const [time, language, codes] = collaborativeInput;
            expect(language).toBe('Java');
            expect(codes).toStrictEqual([]);
            console.log("4 ", language, codes);
        });

        user2.on('user-reconnected', (userId) => {
            expect(userId).toBe("Gc2Bz9Nl8Wx4");
            console.log("4 ", userId);
        });
    });

    test('session should start to terminate once user requests', async() => {
        await user1.emit('user-terminate', 2, 'console.log("java is good");');

        user2.on('notify-terminate', (session) => {
            expect(session).toBe(sessionId);
            console.log("5 ", session);
        });

    });
    
});