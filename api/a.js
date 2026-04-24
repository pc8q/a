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

    // MD5 token
    const raw = `${game}-${user_key}-${serial}-Vm8Lk7Uj2JmsjCPVPVjrLa7zgfx3uz9E`;
    const token = crypto.createHash("md5").update(raw).digest("hex");

    // Current timestamp (seconds)
    const nowTs = Math.floor(Date.now() / 1000);

    // Expiry = +1 day
    const expDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const formattedDate = expDate
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    return res.status(200).json({
      status: true,
      data: {
        token: token,
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

        // 👇 rng now behaves like 1777007512
        rng: nowTs
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
}
