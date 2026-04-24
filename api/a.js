import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  try {
    const { game, user_key, serial } = req.body;

    if (!game || !user_key || !serial) {
      return res.status(400).json({
        status: false,
        message: "Missing parameters",
      });
    }

    // Create MD5 token
    const raw = `${game}-${user_key}-${serial}-Vm8Lk7Uj2JmsjCPVPVjrLa7zgfx3uz9E`;
    const token = crypto.createHash("md5").update(raw).digest("hex");

    // Timestamp + 30 seconds
    const ts = Math.floor(Date.now() / 1000) + 30;

    // Expiry = current date + 1 day
    const now = new Date();
    const expDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const formattedDate = expDate
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    return res.status(200).json({
      status: true,
      data: {
        token: token,
        ts: ts,
        modname: "VIP MOD",
        mod_status: "Safe",
        credit: "MOD STATUS :- 100% SAFE",
        ESP: "on",
        Item: "on",
        AIM: "on",
        SilentAim: "on",
        BulletTrack: "on",
        Floating: "on",
        Memory: "on",
        Setting: "on",
        expired_date: formattedDate,
        EXP: formattedDate,
        exdate: formattedDate,
        device: "30",
        rng: Math.floor(Math.random() * 2000000000),
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}
