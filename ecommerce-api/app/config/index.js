const config = {
  database: {
    connection: 'postgres://postgres:123456@localhost:5432/ecommerce',
  },
  api: {
    host: "0.0.0.0",
    port: 8080,
  },
  jwt: {
    secretKey: "secretKey123",
  },
  sendgrid: {
    secretKey: null,
    fromEmail: null,
  },
  webClient: {
    url: "http://localhost:3000",
  },
};

module.exports = config;
