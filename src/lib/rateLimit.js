// Rate limiter en memoria por instancia de servidor.
// En Vercel (serverless) resetea en cold starts, pero protege contra
// ráfagas de peticiones dentro de una misma instancia activa.
const store = new Map();

export function checkRateLimit(identifier, { max = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now - record.start > windowMs) {
    store.set(identifier, { count: 1, start: now });
    return true;
  }

  if (record.count >= max) return false;
  record.count++;
  return true;
}
