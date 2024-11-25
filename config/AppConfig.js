const path = require('path');
require('dotenv').config();

class AppConfig {
  constructor() {
    this.port = process.env.PORT || 3000;
    this.mongoUri = process.env.MONGO_URI || 'mongodb+srv://panagiotispech:kcTTX8K0xGbEj3pH@cluster0.tgump.mongodb.net/';
    this.jwtSecret = process.env.JWT_SECRET || '\nMIHcAgEBBEIBRXmfQ1B0idHUvQDK5M3lnHrsJ1P8NX6FVA7LWxV/cl76Q6DsLLva\nYyWRYEGISHvu3dyAHX4OlDOuKe5UybB9++KgBwYFK4EEACOhgYkDgYYABAD5+SYn\n4aSiR9RDjR5Oub3f2DtAqx+0klzaVEcj8F3tMf3/+H9H2eSkI4czhZkqtvzbiljJ\nJBEaryFGrt0IGMglRwFEJMGyhK6dmHy1ytZIgiW/YfCUkLV4Q6DMEtjwOiew7I4U\n6xR7ZqInTd0L+kg0bC0qhLoOj/HD220vGABm0oDJ3w==\n-----END EC PRIVATE KEY-----\n","publicKey":"-----BEGIN PUBLIC KEY-----\nMIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQA+fkmJ+GkokfUQ40eTrm939g7QKsf\ntJJc2lRHI/Bd7TH9//h/R9nkpCOHM4WZKrb824pYySQRGq8hRq7dCBjIJUcBRCTB\nsoSunZh8tcrWSIIlv2HwlJC1eEOgzBLY8DonsOyOFOsUe2aiJ03dC/pINGwtKoS6\nDo/xw9ttLxgAZtKAyd8=\n-----END PUBLIC KEY-----\n","algorithm":"ES512","openssl":"OpenSSL 3.3.2 3 Sep 2024 (Library: OpenSSL 3.3.2 3 Sep 2024)","curve":"secp521r1"}' || 'your_secret_key';
    this.publicPath = path.join(__dirname, '..', 'public');
    this.protectedPath = path.join(__dirname, '..', 'protected');
  }

  getMongoConfig() {
    return {
      // Removed deprecated options
    };
  }

  getJwtConfig() {
    return {
      expiresIn: '1h',
      algorithm: 'HS256'
    };
  }
}

module.exports = new AppConfig();
