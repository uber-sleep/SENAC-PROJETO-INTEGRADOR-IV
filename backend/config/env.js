const requiredVars = ['DB_URL', 'JWT_SECRET'];

for (const varName of requiredVars) {
    if (!process.env[varName]) {
        throw new Error(`Variável de ambiente faltando: ${varName}`);
    }
}

if (process.env.DB_URL && !process.env.DB_URL.startsWith('mysql://')) {
    console.warn('DB_URL parece não ser um MySQL válido');
}

module.exports = process.env; 