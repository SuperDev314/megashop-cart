const http = require('http');
const express = require("express");
const cors = require("cors");
const socketIo = require('socket.io');
const bodyParser = require("body-parser");
const db = require("./config");
const port = 5000;
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: '*',
  credentials: true 
}
const io = require("socket.io")(server, {
  cors: corsOptions, 
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', socket => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.get("/cart/:cartId", (req, res) => {
  const cartId = req.params.cartId;
  const query = `
    SELECT product.image, product.price, product.qty, product.description, product.cart_id, cart.total_price
    FROM product
    JOIN cart
    ON product.cart_id = cart.cart_id
    WHERE product.cart_id = '${cartId}'
  `;
  db.query(query, cartId, (err, results) => {
    if (err) {
      console.error("Error retrieving data from database: " + err.stack);
      res.status(500).send("Error retrieving data from database");
      return;
    }
    console.log(`${results}`);
    console.log(results[0]['total_price']);
    res.status(200).send({
      totalPrice: results[0]['total_price'],
      results: results, 
    });
  });
});


app.post("/cart", (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*"); // This allows all domains to access the endpoint.
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type, Access-Control-Allow-Headers");

  const { cartId, allItems, priceTotal } = req.body;
  console.log(`CartId:      ${cartId}`)
  console.log(`Total Price:      ${priceTotal}`)
  try{
    const query =`INSERT INTO cart (cart_id, total_price) VALUES ( '${cartId}', '${priceTotal}' )`;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Error inserting data into database: " + err.stack);
        res.status(500).send("Error inserting data into database");
        return;
      }
      console.log("Data inserted into cart database with ID " + results.insertId);

      // Get data from DataBase
      allItems.forEach(item => {
        const query =`INSERT INTO product (image, price, qty, description, cart_id) VALUES ( '${item.imageUrl}', '${item.priceGood}', ${item.qtyGood}, '${item.contentGood}', '${cartId}' )`;
        db.query(query, (err, results) => {
          if (err) {0
            console.error("Error inserting data into database: " + err.stack);
            res.status(500).send("Error inserting data into database");
            return;
          }
          console.log("Data inserted into product database with ID " + results.insertId);
          //res.status(200).send("Data inserted into database");
        });
      });

      // Send socket message to client
      io.emit('getCartId', cartId);
    });
    db.commit();
  }
  catch(err){
    console.log(err);
    res.send("Error");
  }
  res.send("Success");

});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

////////////////////////////////////////////////////////////


// app.get('/cart/:cartId', async (req, res) => {
//   const cartId = req.params.cartId;

//   try {
//     const response = await axios.post('https://api.paystack.co/transaction/initialize', {
//       email: 'wstar0314@gmail.com', // replace with your customer's email
//       amount: 50000, // amount in kobo
//       callback_url: 'http://localhost:3000/cart/:cartId'
//     }, {
//       headers: {
//         'Authorization': `Bearer ${process.env.sk_test_0074797ed8e763962902b2a58ffe0b2521b84f0f}`
//       }
//     });

//     const authorizationUrl = response.data.data.authorization_url;
//     res.json({ url: authorizationUrl });
//   } catch (error) {
//     console.error('Error initializing transaction:', error);
//     res.status(500).send('Error initializing transaction');
//   }
// });