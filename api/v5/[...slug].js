import crypto from "crypto";

// Format date → YYYY-MM-DD HH:mm:ss
function formatDateTime(date) {
  const pad = (num) => (num < 10 ? "0" : "") + num;

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}

// MD5 generator
function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

// Read raw body manually
function getRawBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
  });
}

export default async function handler(req, res) {
  try {
    // Catch-all route segments
    const { slug } = req.query; 
    // Example:
    // /api/v5/test → ["test"]
    // /api/v5/user/login → ["user", "login"]

    let rawBody = "";

    // Handle body parsing
    if (typeof req.body === "string") {
      rawBody = req.body;
    } else if (req.body && typeof req.body === "object") {
      rawBody = new URLSearchParams(req.body).toString();
    } else {
      rawBody = await getRawBody(req);
    }

    // Parse params
    const params = new URLSearchParams(rawBody);

    const serial = params.get("serial");
    const member_key = params.get("member_key") || "";

    if (!serial) {
      return res.status(400).json({
        status: false,
        error: "serial is required",
        endpoint: slug || [],
      });
    }

    // Token logic
    const rawTokenString = member_key + serial + "VVIPMODS";
    const generatedToken = md5(rawTokenString);

    const currentTimestampSec = Math.floor(Date.now() / 1000);
    const rngValue = currentTimestampSec + 86400;

    const expiryDate = new Date(Date.now() + 4 * 60 * 60 * 1000);
    const expiryString = formatDateTime(expiryDate);

    return res.status(200).json({
      status: true,
      endpoint: slug || [],
      data: {
        token: generatedToken,
        rng: rngValue,
        expired: expiryString,
        EXPR: expiryString,
        registrator: "Muslim",
        xenoanticrack: "XenoV4_Super_Secure_AntiCrack_2026_!!",
      },
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      error: "Server error",
      details: err.message,
    });
  }
}
