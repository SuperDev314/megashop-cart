import * as React from "react";
import { AiOutlineLink } from "react-icons/ai";
import { RiShareBoxFill } from "react-icons/ri";
import { useState, useEffect  } from "react";
import { useParams } from "react-router-dom";
import { PaystackButton } from "react-paystack";
import axios from 'axios';


const ShareCart = () => {
  const { id } = useParams();
  const [cartData, setCartData] = useState({
    results: [], 
    totalPrice: '', 
  })

  useEffect(() => {
    fetch(`http://localhost:5000/cart/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCartData(data)
      })
      .catch(error => console.error(error));
  }, []);

  const config = {
    reference: (new Date()).getTime(),
    email: 'wstar0314@gmial.com',
    amount: 10 * 100,
    publicKey: 'pk_test_337c80d67eb8556548313ea7b5462c6868d466fe',
  }
  
  const handlePaymentSuccess = (reference) => {
    console.log('Payment successful. Transaction reference:', reference);
  };
  
  const handlePaymentClose = () => {
    console.log('Payment window closed.');
  };
  
  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
  };

  return (
    <div className=" flex flex-col bg-sky-300 w-full p-8">
      <p className=" text-center text-5xl text-slate-900 font-bold font-roboto pt-10">
        Shopping Cart Information
      </p>

      <div className="flex flex-col mt-10 bg-slate-100 w-full p-8 rounded-3xl ">
        <div className="flex items-center justify-between ">
            <div className="flex gap-2 justify-center items-center">
                <p className="text-4xl text-gray-500 font-semibold font-poppins">
                    Card ID:
                </p>
                <p className=" text-3xl text-neutral-900 font-medium font-poppins">
                    {cartData && cartData.results.length && cartData.results[0].cart_id}
                </p>
            </div>
            <div className="flex gap-2 justify-center items-center">
                <p className="text-4xl text-gray-500 font-semibold font-poppins">
                    Total Price:
                </p>
                <p className=" text-3xl text-neutral-900 font-medium font-poppins">
                    {cartData && cartData.results.length && cartData.totalPrice}
                </p>
            </div>
        </div>
        <p className="text-2xl text-gray-500 font-light font-poppins mt-5">
          Copy and share the link below.
        </p>
        <button className=" flex items-center justify-between bg-blue-200 h-19 text-left p-3 text-base mt-3 rounded-xl hover:bg-blue-300">
          <div className="flex gap-3">
            <AiOutlineLink size={23} />
            <p> https://localhost:3000/cart/{cartData && cartData.results.length && cartData.results[0].cart_id} </p>
          </div>
          <RiShareBoxFill size={23} />
        </button>
      </div>

      <div className="flex flex-col mt-10 bg-slate-100 w-full p-8 rounded-3xl ">
        <div>
          <p className=" text-center text-4xl text-slate-900 font-semibold font-roboto pt-5 pb-10 ">Cart List</p>
          <div className=" flex flex-col gap-5 ">
            {cartData && cartData.results.length && cartData.results.map((item, index) => (
              <div key={index}>
                <div className="flex gap-20 items-center ">
                    <img src={item.image} alt="Product" />
                    <div>        
                        <p className=" text-xl font-semibold">Price: {item.price}</p>
                        <p className=" text-xl font-semibold">Quantity: {item.qty}</p>
                        <p className=" text-xl font-semibold">Description: {item.description}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className=" bg-red-500">
    
        <PaystackButton
          text="Pay Now"
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
          onError={handlePaymentError}
          {...config}
        />

        <button>Pay</button>

      </div>

    </div>
  );
};

export default ShareCart;


const StartPayment = () => {
  useEffect(() => {
    const startPayment = async () => {
      try {
        const res = await axios.get('/http://localhost:5000/cart/${id}');
        const authorizationUrl = res.data.url;
        window.location.href = authorizationUrl;
      } catch (error) {
        console.error('Error starting payment:', error);
      }
    };

    startPayment();
  }, []);

  return <p>Loading payment...</p>;
};