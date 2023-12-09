import * as crypto from 'crypto';
import * as fs from 'fs';

const secret = crypto.randomBytes(32).toString('base64');

// Записать значение в файл .env
fs.appendFileSync('.env', `JWT_SECRET=${secret}\n`);
// eslint-disable-next-line no-console
console.log('Секрет записан в файл .env');
