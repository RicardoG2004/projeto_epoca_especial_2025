const fastify = require("fastify")({ logger: true });

// Enable CORS for all origins
fastify.register(require("@fastify/cors"), { origin: true });
