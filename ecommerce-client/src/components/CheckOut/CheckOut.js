import React, { Component } from "react";
import BillDetail from "./BillDetail";
import YourOrder from "./YourOrder";
import { connect } from "react-redux";
import { Link, Redirect } from 'react-router-dom'
import callApi from "../../utils/apiCaller";
import { actClearRequest } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { startLoading, doneLoading } from "../../utils/loading";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./style.css";
import Modal from 'react-bootstrap/Modal'
// import { GoogleMap , LoadScript, Polyline, Marker, DirectionsService } from "@react-google-maps/api";

const MySwal = withReactContent(Swal);

toast.configure();

let token, res, resultOrder;
class CheckOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleCheckout: false,
      login: true,
      shippingAddress: false,
      checkout: false,
      result: false,
      // modalShow: false,
      lopOrder :'',
      redirectTo: false,
      // numberOrders:1,
    };
    this.billing = React.createRef();
  }

  componentDidMount(props) {
    token = localStorage.getItem("_auth");
    // console.log('test',this.props)
  }
  


  submitOrder = async () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You want to check out now?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Checkout now!",
    }).then(async (result) => {
      const cart = this.props.cartStore;
      if (result.value) {
        // const { provinceData, stateData } = res; //get code
        const resData = await callApi("users/me", "GET", null, token);
        const userId = resData.data.results[0].id;
        const promoTotal = 0;
        if (res.name === "" || res.address === "" || res.phone === "") {
          return toast.error("Please complete form before checkout");
        }
        //GET DATA FOR TABLE ORDER
        let amount = 0;
        let ship = 2; //setStatic
        if (cart.length > 0) {
          amount = cart.reduce((sum, item) => {
            return (sum += item.quantity * item.price);
          }, 0);
        } //output total Amount
        // let addressProvince;
        // if (res.provinces && res.provinces.length) {
        //   res.provinces.map((item) => {
        //     if (item.code === provinceData) {
        //       addressProvince = item.name;
        //       return addressProvince;
        //     }
        //     return { message: "error" };
        //   }); //output name province
        // }

        // let addressState;
        // if (res.states && res.states.length) {
        //   res.states.map((item) => {
        //     if (item.code === stateData) {
        //       addressState = item.name;
        //       return addressState;
        //     }
        //     return { message: "error" };
        //   }); //output name state
        // }

        // const addressResult = {
        //   province: addressProvince,
        //   state: addressState,
        //   house: res.address,
        //   codeProvince: provinceData,
        //   codeState: stateData,
        // }; // output address
        // console.log('address',addressResult)
        // const addressResult2 = res.address + ',' + addressState + ',' + addressProvince;
        const addressResult2 = res.address;

        const note = res.note !== "" ? res.note : "";
        // const atStore = localStorage.getItem('_atStore');
        // const { lopOrder } = this.state
        const lopOrder = this.get_lop();
        // const numOrders = localStorage.getItem('numOrders')
        const atStore = localStorage.getItem('_atStore');
        // console.log('res', res)
        if (!res.lat){
          res.lat = 10.773392736860279
        }
        if (!res.lng){
          res.lng = 106.66067562399535
        }
        const resultOrder = {
          fullName: res.name,
          address: addressResult2,
          note: note,
          phone: res.phone,
          shippingTotal: ship ,
          itemAmount: parseFloat(amount.toFixed(2)),
          promoTotal,
          userId,
          totalAmount: parseFloat((ship + amount - promoTotal).toFixed(2)),
          atStore : atStore,
          lop : lopOrder,
          lat: res.lat,
          lng: res.lng,
          isPaymentOnline: false,
          isPaid: false,
        };
        console.log('submit order', resultOrder)
        //insert order to db
        startLoading();
        const orderDb = await callApi("orders", "POST", resultOrder, token); //method post nen truyen them token tren headers
        // console.log('orderDB',orderDb)
        //END GET DATA FOR TABLE ORDER

        // var lop = ""
        // //GET DATA ORDER_DETAIL
        // cart.map(async (item) => {
        //   const resultOrderDetail = {
        //     quantity: item.quantity,
        //     price: item.price,
        //     orderId: orderDb.data.id,
        //     productId: item.id,
        //     nameProduct: item.nameProduct,
        //   };
        //   lop = lop + item.id + "-" + item.quantity + ",";
        //   const payloadNumberAvailable = { numberAvailable: item.quantity };
        //   const changeNumberAvailableProduct = callApi(
        //     `products/${item.id}/updateNumberAvailable`,
        //     "PUT",
        //     payloadNumberAvailable,
        //     token
        //   );
        //   const addOrderDetail = callApi(
        //     "orderDetails",
        //     "POST",
        //     resultOrderDetail,
        //     token
        //   );
        //   await Promise.all([changeNumberAvailableProduct, addOrderDetail]);
        //   MySwal.fire({
        //     position: "top-end",
        //     icon: "success",
        //     title: "Success!",
        //     showConfirmButton: true,
        //     timer: 1500000,
        //   });
        //   this.setState({
        //     checkout: true,
        //     result: true,
        //   });
        //   doneLoading();
        // });
        // //ENDGET DATA ORDER_DETAIL
        // lop = lop.slice(0, -1);
        // console.log(lop);
        // var addr = addressResult.house + ", " + addressResult.state + ", " + addressResult.province;
        // console.log(addr);
        //   const getStore = {
        //     address: addr,
        //     userId: userId
        //   }
        // console.log(getStore);
        // const feedback = await callApi("getstore", "POST", getStore, token);
        // console.log(feedback);
        //CLEAR CART AFTER CHECKOUT IF input Available Address
        // if(feedback.status === 200 || feedback.data === "successful" ){
          this.props.reset_cart();
          this.setState({
            redirectTo: true
          })
        // }
      }
    });
  };

  toggleCheckout = async () => {
    const { toggleCheckout, shippingAddress } = this.state;
    const auth = localStorage.getItem("_auth");
    // console.log('auth', auth)
    if (!auth) {
      return toast.error("Missing authentication!");
    }

    // console.log('billing',this.billing.current)
    res = this.billing.current.getBillingState();
    // console.log('res',res)
    // const { provinceData, stateData } = res; //get code
    const resData = await callApi("users/me", "GET", null, token);
    const userId = resData.data.results[0].id;
    const builder = localStorage.getItem("_cart");
    const dataCart = JSON.parse(builder);
    if (res.name === "" || res.address === "" || res.phone === "") {
      return toast.error("Please complete form before checkout");
    }
    // let addressProvince;
    // if (res.provinces && res.provinces.length) {
    //   res.provinces.map((item) => {
    //     if (item.code === provinceData) {
    //       addressProvince = item.name;
    //       return addressProvince;
    //     }
    //     return { message: "error" };
    //   }); //output name province
    // }

    // let addressState;
    // if (res.states && res.states.length) {
    //   res.states.map((item) => {
    //     if (item.code === stateData) {
    //       addressState = item.name;
    //       return addressState;
    //     }
    //     return { message: "error" };
    //   }); //output name state
    // }
    // const addressResult = {
    //   province: addressProvince,
    //   state: addressState,
    //   house: res.address,
    //   codeProvince: provinceData,
    //   codeState: stateData,
    // }; // output address
    // const addressResult2 = res.address + ',' + addressState + ',' + addressProvince;
    const addressResult2 = res.address ;
    const note = res.note !== "" ? res.note : "";
    let amount = 0;
    let dataItems = [];
    dataCart.forEach((item) => {
      dataItems.push({
        sku: item.id,
        name: item.nameProduct,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        currency: "USD",
      });
    });
    if (dataCart.length > 0) {
      amount = dataCart.reduce((sum, item) => {
        return (sum += item.quantity * item.price);
      }, 0);
    } //output total Amount
    // const numOrders = localStorage.getItem('numOrders')
    const lopOrder = this.get_lop();
    const atStore = localStorage.getItem('_atStore');
    if (!res.lat){
      res.lat = 10.773392736860279
    }
    if (!res.lng){
      res.lng = 106.66067562399535
    }
    // const { lopOrder } = this.state
    resultOrder = {
      fullName: res.name,
      address: addressResult2,
      note: note,
      phone: res.phone,
      itemAmount: amount,
      promoTotal: 0,
      shippingTotal: 2,
      totalAmount: amount + 2,
      orderBill: {
        customer: userId,
        total: amount,
        items: dataItems,
        itemsDetails: dataCart,
      },
      token,
      atStore : atStore,
      lop : lopOrder,
      lat : res.lat, 
      lng : res.lng,
    };
    console.log('resultOrder',resultOrder)
    let payload2 = {
      userId : userId,
      lop : lopOrder,
      lat : res.lat,
      lng : res.lng,
    }
    if ( atStore == 'All'){
      const res3 = await callApi("getparseorder", "POST", payload2, token)
      if ( res3 && res3.status == 200){
        // this.setState({
        //   numberOrders : res3.data
        // })
        localStorage.setItem('numOrders', res3.data)
      }
      
      // console.log('numberOrder',res3)
    }else{
      localStorage.setItem('numOrders', 1)
    }   
    this.setState({
      toggleCheckout: !toggleCheckout,
      shippingAddress: !shippingAddress,
    });
  };

  changeToggle(result) {
    if (result === true) {
      this.setState({
        checkout: true,
        result: true,
      });
    }
    //CLEAR CART AFTER CHECKOUT
    this.props.reset_cart();
  }

  get_lop = () => {
    // token = localStorage.getItem("_auth");
    //   if (!token) {
    //   return toast.error("Missing authentication!");
    //   }
      // console.log('Next Step',payload)
      // const resData = await callApi("users/me", "GET", null, token);
      // const userId = resData.data.results[0].id;
      // output user id
      const builder = localStorage.getItem("_cart");
      const dataCart = JSON.parse(builder);
      // const payload1 = {
      // address:"268 Lý Thường Kiệt, Phường 14, Quận 10, Thành phố Hồ Chí Minh, Việt Nam",
      // userId: userId
      // }
      // let getstore
      // await callApi("getstore", "POST", payload1, token).then(res => {
      // getstore = res.data
      // });
      // console.log('getstore',getstore)

      // let dataItems = [];
      let lop='';
      dataCart.forEach((item) => {
      // dataItems.push({
      //     sku: item.id,
      //     name: item.nameProduct,
      //     description: item.description,
      //     quantity: item.quantity,
      //     price: item.price,
      //     currency: "USD",
      // });
      if(lop == '') lop = item.id.toString() + '-' + item.quantity.toString()
      else {
          lop = lop + ',' + item.id.toString() + '-' + item.quantity.toString()   
      }
      });
      // this.setState({
      //   lopOrder : lop
      // })
      // console.log('lop',lop)
      return lop
      // const payload2 = {
      // "lop": lop,
      // "userId":userId
      // }
      // await callApi("getsuggestion", "POST", payload2, token).then(res =>{
      //     this.setState({
      //         getsuggestion : res.data
      //     })
      // // getsuggestion = res.data
      // });
      // console.log('getsuggestion', this.state.getsuggestion)
  }


  MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Notification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your quantity is more than any one of our particular stores has. We have recommend for you. Let take a quick view ?
          {/* {console.log('request',this.state.request)} */}
          {/* <h4>Name Product </h4>
          <input  style={{width:"100%"}} disabled defaultValue={props.requests.name}/>   */}
        </Modal.Body>
        <Modal.Footer>
          <Link to="/suggestioncart"><button type="button" class="btn btn-primary" onClick={props.onHide}>Accept</button></Link>
          <button type="button" class="btn btn-info" onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    // let atStore = 
    // console.log('atstore Checkout', localStorage.getItem('_atStore'))
    // console.log('numberOrders', localStorage.getItem('numOrders'))
    const {
      redirectTo,
      toggleCheckout,
      shippingAddress,
      checkout,
      result,
    } = this.state;
    // console.log('state',this.state)
    if (redirectTo) {
      return <Redirect to="/after-checkout"></Redirect>;
    }
    return (
      <div className="checkout-area pt-60 pb-30">
        <div className="container">
          <div
            className="row"
            style={{ textAlign: "center", marginTop: -25, paddingBottom: 10 }}
          >
            <div className="col-3"></div>
            <div className="col-6">
              <div className="container">
                <ul className="progressbar">
                  <li className="active">login</li>
                  {shippingAddress ? (
                    <li className="active">SHIPPING ADDRESS</li>
                  ) : (
                    <li>SHIPPING ADDRESS</li>
                  )}
                  {checkout ? (
                    <li className="active">CHECKOUT</li>
                  ) : (
                    <li>CHECKOUT</li>
                  )}
                  {result ? (
                    <li className="active">RESULT</li>
                  ) : (
                    <li>RESULT</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="col-3"></div>
          </div>
          {result ? (
            <div className="row">
              <div className="col-lg-12">
                <div className="error-wrapper text-center ptb-50 pt-xs-20">
                  <div>
                    <img
                      src="https://i.ibb.co/pvDhxPj/checked-ok-yes-icon-1320196391133448530.png"
                      alt="checked"
                      height="70px"
                    />
                    <h1>Thank You.</h1>
                  </div>
                  <div>
                    <h1>Your order was completed successfully.</h1>
                  </div>
                  <div>
                    <p>
                      <i>
                        The details of your order have been sent to the email.
                        Please check your email to check the status of your
                        order.
                      </i>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {toggleCheckout ? (
                <YourOrder
                  changeToggle={(result) => this.changeToggle(result)}
                  order={resultOrder}
                  submitOrder={() => this.submitOrder()}
                ></YourOrder>
              ) : (
                <BillDetail ref={this.billing}></BillDetail>
              )}
              <div className="col-12" style={{ textAlign: "center" }}>
                {!toggleCheckout ? (
                  <div>
                    <button
                      onClick={() => this.toggleCheckout()}
                      // onClick={() => this.testFunction()}
                      className="btn btn-primary"
                      style={{ marginTop: -25, marginBottom: 10 }}
                    >
                      Next Step
                    </button>
                    {/* <this.MyVerticallyCenteredModal
                      show={this.state.modalShow}
                      onHide={() => this.setState({modalShow: false})}
                    /> */}
                  </div>
                  
                  
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cartStore: state.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reset_cart: () => {
      dispatch(actClearRequest());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CheckOut);
