import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const ping = process.env.PING_MESSAGE ?? 'ping';
  res.status(200).json({ message: ping });
}
