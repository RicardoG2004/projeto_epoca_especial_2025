const fastify = require("fastify")({ logger: true });
const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require('dotenv').config();

// Enable CORS for all origins
fastify.register(require("@fastify/cors"), { origin: true });

// Webhook configuration
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://webhook.site/your-unique-url';
const WEBHOOK_ENABLED = process.env.WEBHOOK_ENABLED === 'true' || false;

// Webhook function to send events
async function sendWebhook(event, data) {
  if (!WEBHOOK_ENABLED) {
    console.log(`🔴 Webhook DISABLED for event: ${event}`);
    return;
  }
  
  try {
    const webhookData = {
      event: event,
      timestamp: new Date().toISOString(),
      data: data
    };
    
    console.log(`🟢 Sending webhook for event: ${event}`);
    console.log(`📤 Data:`, JSON.stringify(webhookData, null, 2));
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WeatherMap-Webhook/1.0'
      },
      body: JSON.stringify(webhookData)
    });
    
    if (response.ok) {
      console.log(`✅ Webhook sent successfully for event: ${event}`);
      console.log(`📊 Response status: ${response.status}`);
    } else {
      console.log(`❌ Webhook failed for event: ${event}, status: ${response.status}`);
    }
  } catch (error) {
    console.log(`💥 Webhook error for event: ${event}:`, error.message);
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

fastify.post("/login", async (request, reply) => {
  const { email, password } = request.body;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);
    
    if (error) {
      // Send webhook for failed login
      await sendWebhook('login_failed', {
        email: email,
        error: error.message,
        ip: request.ip,
        userAgent: request.headers['user-agent']
      });
      
      return reply.code(401).send({ error: error.message });
    }
    
    // Send webhook for successful login
    await sendWebhook('login_success', {
      email: email,
      userId: data?.user?.id,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
    
    // Return the access_token for frontend to store
    return { message: "Login bem sucedido!", token: data?.session?.access_token };
  } catch (error) {
    fastify.log.error('Login error:', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
});

fastify.post("/register", async (request, reply) => {
  const { email, password } = request.body;
  
  console.log("🔐 Register attempt for email:", email);
  
  // Validate input
  if (!email || !password) {
    console.log("❌ Missing email or password");
    return reply.code(400).send({ error: "Email and password are required" });
  }
  
  try {
    console.log("📡 Calling Supabase auth.signUp...");
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    console.log("📊 REGISTER DATA:", JSON.stringify(data, null, 2));
    console.log("❌ REGISTER ERROR:", error);
    
    if (error) {
      console.log("🚫 Registration failed:", error.message);
      
      // Send webhook for failed registration
      await sendWebhook('register_failed', {
        email: email,
        error: error.message,
        ip: request.ip,
        userAgent: request.headers['user-agent']
      });
      
      return reply.code(400).send({ error: error.message });
    }
    
    console.log("✅ Registration successful for:", email);
    
    // Send webhook for successful registration
    await sendWebhook('register_success', {
      email: email,
      userId: data?.user?.id,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
    
    return { 
      message: "Registration successful! Please check your email to confirm your account.",
      user: data?.user 
    };
  } catch (error) {
    console.log("💥 Registration error:", error);
    fastify.log.error('Registration error:', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
});

// New endpoint for city search events
fastify.post("/webhook/city-search", async (request, reply) => {
  const { city, userId, userEmail } = request.body;
  
  try {
    // Send webhook for city search
    await sendWebhook('city_search', {
      city: city,
      userId: userId,
      userEmail: userEmail,
      timestamp: new Date().toISOString(),
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
    
    return { message: "City search event logged successfully" };
  } catch (error) {
    fastify.log.error('City search webhook error:', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
});

// New endpoint for weather data fetch events
fastify.post("/webhook/weather-fetch", async (request, reply) => {
  const { city, lat, lon, userId, userEmail } = request.body;
  
  try {
    // Send webhook for weather data fetch
    await sendWebhook('weather_fetch', {
      city: city,
      coordinates: { lat, lon },
      userId: userId,
      userEmail: userEmail,
      timestamp: new Date().toISOString(),
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
    
    return { message: "Weather fetch event logged successfully" };
  } catch (error) {
    fastify.log.error('Weather fetch webhook error:', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
});

// New endpoint for forecast view events
fastify.post("/webhook/forecast-view", async (request, reply) => {
  const { city, userId, userEmail } = request.body;
  
  try {
    // Send webhook for forecast view
    await sendWebhook('forecast_view', {
      city: city,
      userId: userId,
      userEmail: userEmail,
      timestamp: new Date().toISOString(),
      ip: request.ip,
      userAgent: request.headers['user-agent']
    });
    
    return { message: "Forecast view event logged successfully" };
  } catch (error) {
    fastify.log.error('Forecast view webhook error:', error);
    return reply.code(500).send({ error: 'Internal server error' });
  }
});

// Health check endpoint
fastify.get("/", async (request, reply) => {
  return { message: "WeatherMap API is running!", webhooks_enabled: WEBHOOK_ENABLED };
});

// Webhook status endpoint
fastify.get("/webhook/status", async (request, reply) => {
  return { 
    enabled: WEBHOOK_ENABLED,
    url: WEBHOOK_ENABLED ? WEBHOOK_URL : null,
    events: ['login_success', 'login_failed', 'register_success', 'register_failed', 'city_search', 'weather_fetch', 'forecast_view'],
    server_time: new Date().toISOString(),
    message: WEBHOOK_ENABLED ? 'Webhooks estão ativos' : 'Webhooks estão desabilitados'
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server is running on port 3000");
    console.log(`Webhooks enabled: ${WEBHOOK_ENABLED}`);
    if (WEBHOOK_ENABLED) {
      console.log(`Webhook URL: ${WEBHOOK_URL}`);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
