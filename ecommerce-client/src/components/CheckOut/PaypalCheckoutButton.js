import ReactDOM from "react-dom";
import paypal from "paypal-checkout";
import callApi from "../../utils/apiCaller";
import React, { Component } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { config } from '../../config'
const MySwal = withReactContent(Swal)
let order;
let ship = 2;
export default class PaypalCheckoutButton extends Component {
  
  componentDidMount() {
    order = this.props.order;
  }
  render() {
    const paypalConf = {
      currency: "USD",
      env: "sandbox",
      client: {
        sandbox: config.paypal.secretKey,
        production: "---id---"
      },
      style: {
        locale: "en_US",
        size: "medium",
        color: "gold",
        shape: "pill",
        label: "paypal",
        tagline: "true",
        layout: "horizontal",
        fundingicons: "true"
      },
      funding: {
        allowed: [paypal.FUNDING.CREDIT]
      },
      commit: true
    };
    const PayPalButton = paypal.Button.driver("react", { React, ReactDOM });
    const payment = (data, actions) => {
      return actions.payment.create({
        transactions: [
          {
            amount: {
              total: order.totalAmount,
              currency: paypalConf.currency,
              details: {
                subtotal: order.itemAmount,
                tax: 0,
                shipping: order.shippingTotal
              }
            },
            description: order.note,
            custom: order.orderBill.customer || "",
            item_list: {
              items: order.orderBill.items
            }
          }
        ]
      });
    };

    const onAuthorize = async (data, actions) => {
      return actions.payment
        .execute()
        .then(async response => {
          const token = localStorage.getItem("_auth");
          const promoTotal = 0;
          const newOrder = {
            fullName: order.fullName,
            address: order.address,
            note: order.note,
            phone: order.phone,
            shippingTotal: ship,
            itemAmount: order.orderBill.total,
            promoTotal,
            status: "Unconfirm",
            userId: order.orderBill.customer,
            paypalCode: response.id,
            isPaymentOnline: true,
            isPaid: true,
            totalAmount: ship + order.orderBill.total - promoTotal
          };
          const orderDb = await callApi("orders", "POST", newOrder, token);
          console.log(orderDb);
          var lop = "";
          order.orderBill.itemsDetails.map(async item => {
            const resultOrderDetail = {
              quantity: item.quantity,
              price: item.price,
              orderId: orderDb.data.id,
              productId: item.id,
              nameProduct: item.nameProduct
            };
            lop = lop + item.id + "-" + item.quantity + ",";
            await callApi("orderDetails", "POST", resultOrderDetail, token);
          });
          lop = lop.slice(0, -1);
          console.log(lop);
          var addr = order.address.house + ", " + order.address.state + ", " + order.address.province;
          console.log(addr);
          const getStore = {
            address: addr,
            orderId: orderDb.data.id,
            lop: lop
          }
          const feedback = await callApi("getstore", "POST", getStore, token);
          console.log(feedback);
          this.props.changeToggle(true);
          MySwal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Success!',
            showConfirmButton: true,
            timer: 15000
          })
        })
        .catch(error => {
          console.log(error);
        });
    };
    const onError = error => {
      console.log(error);
    };
    const onCancel = (data, actions) => {
      MySwal.fire('Paypal checkout has been closed');
    };
    return (
      <PayPalButton
        env={paypalConf.env}
        client={paypalConf.client}
        payment={(data, actions) => payment(data, actions)}
        onAuthorize={(data, actions) => onAuthorize(data, actions)}
        onCancel={(data, actions) => onCancel(data, actions)}
        onError={error => onError(error)}
        style={paypalConf.style}
      ></PayPalButton>
    );
  }
}
