const apiAdapter = require("../../apiAdapter");
const jwt = require("jsonwebtoken");

const {
  URL_SERVICE_USER,
  JWT_SECRET,
  JWT_SECRET_REFRESH_TOKEN,
  JWT_ACCESS_EXPIRED_TOKEN,
  JWT_REFRESH_EXPIRED_TOKEN,
} = process.env;

const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    const user = await api.post("/users/login", req.body);
    const data = user.data.data;

    const token = jwt.sign({ data }, JWT_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRED_TOKEN,
    });
    const refreshToken = jwt.sign({ data }, JWT_SECRET_REFRESH_TOKEN, {
      expiresIn: JWT_REFRESH_EXPIRED_TOKEN,
    });

    await api.post("/refresh_token", {
      refresh_tokens: refreshToken,
      user_id: data.id,
    });

    return res.json({
      status: "success",
      data: {
        token,
        refresh_tokens: refreshToken,
      },
    });
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res
        .status(500)
        .json({ status: "error", message: "service unavailable" });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
