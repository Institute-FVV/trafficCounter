module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.port,
    db: {
        sequelize: {
          logging: true,
          database: process.env.PGDATABASE || 'trafficCounter',
          username: process.env.PGUSER || 'postgres',
          password: process.env.PGPASSWORD || 'password',
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
    captcha_site_key: process.env.REACT_APP_CAPTCHA_SITE_KEY || ""
}