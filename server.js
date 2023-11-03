const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51LzK4CErbhToF1iQV2niPoVnxxedkLhzM0NLuWDUX8LDz8HrhmgpOA8QGWg4UuBoiI86pLpHTDpUNpNO1whPGZc400OV9WCslE"
);
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Abol");
});

app.post("/checkout", async (req, res) => {
  let error;
  let status;
  try {
    const { cart, token } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const key = uuidv4();
    const charge = await stripe.charges.create(
      {
        amount: cart.totalPrice * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: "product description here",
        shipping: {
          name: token.card.name,
          address: {
            line1npm: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.car.address_city,
            country: token.car.address_country,
            postal_code: token.card.address_zip,
          },
        },
      },
      { idempotencyKey: key }
    );
    status = "success";
  } catch {
    console.log(error);
    status = "error";
  }
  res.json({ status });
});

app.listen(8080, () => {
  console.log("your app is running in port # 8080");
});
