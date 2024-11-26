const generatePaypalAccessToken = async () => {
  try {
    const authString = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`;
    const base64Auth = Buffer.from(authString).toString("base64");
    const res = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64Auth}`,
        },
        body: "grant_type=client_credentials",
      }
    );
    const result = await res.json();
    return result.access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { generatePaypalAccessToken };
