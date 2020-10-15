module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.port,
    db: {
        sequelize: {
          logging: true,
          database: process.env.PGDATABASE || 'trafficCounter',
          username: process.env.PGUSER || '',
          password: process.env.PGPASSWORD || '',
          host: process.env.PGHOST || '/var/run/postgresql',
          port: process.env.PGPORT || 5432,
          pool: {
            max: 12,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        }
      },
}