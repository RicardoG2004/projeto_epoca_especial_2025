require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

console.log("=== Teste de Conexão Supabase ===");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "✅ Definida" : "❌ Não definida");
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Definida" : "❌ Não definida");

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log("\n❌ ERRO: Variáveis de ambiente não configuradas!");
  console.log("Crie um arquivo .env na raiz do projeto com:");
  console.log("SUPABASE_URL=sua_url_aqui");
  console.log("SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui");
  process.exit(1);
}

try {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  console.log("\n✅ Conexão com Supabase estabelecida com sucesso!");
  console.log("URL:", process.env.SUPABASE_URL);
  
} catch (error) {
  console.log("\n❌ ERRO na conexão com Supabase:");
  console.log(error.message);
} 