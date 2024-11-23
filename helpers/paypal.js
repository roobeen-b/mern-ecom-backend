const generatePaypalAccessToken = async () => {
  try {
    console.log(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
    let bodyData = `client_id=${process.env.PAYPAL_CLIENT_ID}&client_secret=${process.env.PAYPAL_CLIENT_SECRET}&grant_type=client_credentials`;
    console.log(bodyData, "bodydata");
    const res = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyData,
      }
    );
    const result = await res.json();
    console.log(result, "resultltl");
    return result.access_token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { generatePaypalAccessToken };
