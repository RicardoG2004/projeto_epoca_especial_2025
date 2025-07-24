require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const { createClient } = require("@supabase/supabase-js");

// Enable CORS for all origins
fastify.register(require("@fastify/cors"), { origin: true });

fastify.get("/", async (request, reply) => {
  return { message: "Hello from Fastify API!" };
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

fastify.post("/login", async (request, reply) => {
  const { email, password } = request.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("LOGIN DATA:", data);
  console.log("LOGIN ERROR:", error);
  if (error) {
    return reply.code(401).send({ error: error.message });
  }
  // Return the access_token for frontend to store
  return { message: "Login successful!", token: data?.session?.access_token };
});

fastify.post("/register", async (request, reply) => {
  const { email, password } = request.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return reply.code(400).send({ error: error.message });
  }
  return { message: "Registration successful! Please check your email.", data };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info(`Server listening on http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
