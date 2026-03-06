import crypto from "crypto";

export default function handler(req, res) {
  // Permitir CORS desde cualquier origen (solo para desarrollo)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { meetingNumber, role } = req.body;

  if (!meetingNumber) {
    return res.status(400).json({ error: "meetingNumber es requerido" });
  }

  const sdkKey    = process.env.ZOOM_SDK_KEY;
  const sdkSecret = process.env.ZOOM_SDK_SECRET;

  if (!sdkKey || !sdkSecret) {
    return res.status(500).json({ error: "Credenciales de Zoom no configuradas" });
  }

  const timestamp = Math.round(new Date().getTime() / 1000) - 30;
  const msg       = Buffer.from(sdkKey + meetingNumber + timestamp + (role || 0)).toString("base64");
  const hash      = crypto.createHmac("sha256", sdkSecret).update(msg).digest("base64");
  const signature = Buffer.from(`${sdkKey}.${meetingNumber}.${timestamp}.${role || 0}.${hash}`).toString("base64");

  return res.status(200).json({ signature, sdkKey });
}
