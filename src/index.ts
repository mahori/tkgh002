import * as express from 'express';
import { getGeoIp } from './geoip';

const PORT = 3000;

const app = express.default();

app.get('/geoip/:ipAddress', (req, res) => {
  const ipAddress = req.params.ipAddress as string;
  if (!ipAddress) {
    return res.status(400).json({ error: 'IPアドレスが指定されていません。' });
  }

  const result = getGeoIp(ipAddress);
  if (!result.city && !result.country && !result.asn) {
    return res.status(404).json({ error: '指定されたIPアドレスの地理情報が見つかりませんでした。' });
  }

  return res.json({
    ip: ipAddress,
    asn: result.asn,
    city: result.city,
    country: result.country,
  })
})

async function startServer() {
  app.listen(PORT, () => {
    console.log(`GeoIP API サーバーが起動しました: http://localhost:${PORT}`);
  })
}

startServer();
