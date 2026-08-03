// Utilitários de autenticação customizada
// Sistema de hash de senha simples (para desenvolvimento)
// Em produção, use uma biblioteca de hash adequada (bcrypt, argon2, etc)

/**
 * Hash simples de senha (SHA-256)
 * ATENÇÃO: Para produção, use uma biblioteca de hash adequada com salt (bcrypt, argon2, etc)
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Normalizar a senha: remover espaços em branco e garantir encoding UTF-8
    const normalizedPassword = password.trim();
    
    // Usar Web Crypto API para hash SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(normalizedPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log("🔐 Hash gerado para senha (primeiros 20 chars):", hashHex.substring(0, 20));
    console.log("🔐 Senha normalizada:", normalizedPassword);
    console.log("🔐 Comprimento da senha:", normalizedPassword.length);
    console.log("🔐 Bytes da senha:", Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' '));
    return hashHex;
  } catch (error) {
    console.error("❌ Erro ao gerar hash:", error);
    throw error;
  }
};

/**
 * Verificar senha
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    if (!hash || typeof hash !== 'string') {
      console.error("❌ Hash inválido:", hash);
      return false;
    }
    
    const passwordHash = await hashPassword(password);
    const isValid = passwordHash === hash;
    
    if (!isValid) {
      console.log("❌ Hashes não coincidem");
      console.log("Hash da senha (primeiros 20):", passwordHash.substring(0, 20));
      console.log("Hash no banco (primeiros 20):", hash.substring(0, 20));
    } else {
      console.log("✅ Hashes coincidem!");
    }
    
    return isValid;
  } catch (error) {
    console.error("❌ Erro ao verificar senha:", error);
    return false;
  }
};

/**
 * Gerar token de sessão simples
 */
export const generateSessionToken = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback para navegadores sem randomUUID (usa crypto.getRandomValues)
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // versão 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variante RFC 4122

    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    return (
      toHex(bytes[0]) +
      toHex(bytes[1]) +
      toHex(bytes[2]) +
      toHex(bytes[3]) +
      "-" +
      toHex(bytes[4]) +
      toHex(bytes[5]) +
      "-" +
      toHex(bytes[6]) +
      toHex(bytes[7]) +
      "-" +
      toHex(bytes[8]) +
      toHex(bytes[9]) +
      "-" +
      toHex(bytes[10]) +
      toHex(bytes[11]) +
      toHex(bytes[12]) +
      toHex(bytes[13]) +
      toHex(bytes[14]) +
      toHex(bytes[15])
    );
  }

  // Último recurso: usa Math.random (menos seguro, mas garante funcionamento)
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

