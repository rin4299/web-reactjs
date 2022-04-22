import React, { Component } from 'react'
import ShoppingCartItems from './ShoppingCartItems'
import { actFetchCartRequest } from '../../redux/actions/cart';
import { connect } from 'react-redux'
import SumTotal from './SumTotal';
import callApi from "../../utils/apiCaller";
import { toast } from "react-toastify";
import { Link , Redirect } from 'react-router-dom'
import { formatNumber } from '../../config/TYPE'
import { actRemoveCartRequest, actUpdateCartRequest } from '../../redux/actions/cart';

let token
class SuggestionCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterStore: 'All',
            getsuggestion:[,],
            redirectYourOrder: false,
            redirectYourLogin: false
        }
    }
    async componentDidMount() {
        this.props.fetch_items();
        token = localStorage.getItem("_auth");
        if (!token) {
        return toast.error("Missing authentication!");
        }
        // console.log('Next Step',payload)
        const resData = await callApi("users/me", "GET", null, token);
        const userId = resData.data.results[0].id;
        // output user id
        const builder = localStorage.getItem("_cart");
        const dataCart = JSON.parse(builder);
        // console.log(dataCart)
        // if (res.name === "" || res.address === "" || res.phone === "") {
        //   return toast.error("Please complete form before checkout");
        // }
        // const payload1 = {
        // address:"268 Lý Thường Kiệt, Phường 14, Quận 10, Thành phố Hồ Chí Minh, Việt Nam",
        // userId: userId
        // }
        // let getstore
        // await callApi("getstore", "POST", payload1, token).then(res => {
        // getstore = res.data
        // });
        // console.log(getstore)

        let dataItems = [];
        let lop='';
        dataCart.forEach((item) => {
        dataItems.push({
            sku: item.id,
            name: item.nameProduct,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            currency: "USD",
        });
        if(lop == '') lop = item.id.toString() + '-' + item.quantity.toString()
        else {
            lop = lop + ',' + item.id.toString() + '-' + item.quantity.toString()   
        }
        });
        console.log(lop)
        const payload2 = {
        "lop": lop,
        "userId":userId
        }
        let getsuggestion;
        await callApi("getsuggestion", "POST", payload2, token).then(res =>{
            this.setState({
                getsuggestion : res.data
            })
        // getsuggestion = res.data
        });
        console.log('getsuggestion', this.state.getsuggestion)
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        // console.log(name, value)
        this.setState({
          [name]: value
        });
    }

    showItem(items) {
    console.log('items in suggestion cart',items)

    let result = null;
    if (items.length > 0) {
        result = items.map((item, index) => {
        return (
            <ShoppingCartItems key={index} item={item} ></ShoppingCartItems>
        );
        });
    }
    return result;
    }

    upItem = (item) => {
        if (item.quantity >= item.numberAvailable) {
            toast.error('Quantity products exceeds the limit we have')
            return
        }
        let newItem = item;
        newItem.quantity++;
        this.props.changQuantityItem(newItem);
    }

    downItem = (item) => {
        if (item.quantity <= 1) {
            return
        }
        let newItem = item;
        newItem.quantity--;
        this.props.changQuantityItem(newItem);
    }

    removeItem = (item) => {
        this.props.removeItem(item);
        toast.success('Delete product is successful')
    }

    checkAuthenticate = () => {
        const { user, items } = this.props;
        if (!items.length) {
          return toast.error('Please purchase items before payment');
        }
        if (user) {
          this.setState({
            redirectYourOrder: true
          })
        } else {
          toast.error('You can login before checkout');
          this.setState({
            redirectYourLogin: true
          })
        }
    }

  render() {
    const { items } = this.props;
    const { getsuggestion , filterStore , redirectYourOrder, redirectYourLogin } = this.state;
    let amount = 0;
    let shippingTotal = 2;
    if (items.length > 0 && filterStore=='All') {
      amount = items.reduce((sum, item) => {
        return sum += item.quantity * item.price
      }, 0)
    }
    else {
        let newItems
        if(getsuggestion[0] && getsuggestion[0].length > 0){
            newItems = getsuggestion[0].filter((item)=> {
               return item.storeName == filterStore
            })
            console.log('newItem',newItems)
        }
    }
    console.log('test total',getsuggestion[0])
    if (redirectYourOrder) {
      return <Redirect to="/checkout"></Redirect>
    }
    if (redirectYourLogin) {
      return <Redirect to="/login-register"></Redirect>
    }
    return (
        <div>
            <div className='container'>
                <div className="row justify-content-md-center">
                    <ul className="nav nav-tabs" style={{ paddingTop: 30, marginLeft: 100}} id="myTab" role="tablist">
                        <li className="nav-item">
                            <button className="nav-link active btn-lg" name="filterStore" value="All" data-toggle="tab" role="tab" aria-controls="all" aria-selected="true" onClick={this.handleChange}>All</button>
                            {/* <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="all" aria-selected="true">All</a> */}
                        </li>
                        {getsuggestion[0] ? getsuggestion[0].map((item,index) =>{
                            {/* console.log('item',item) */}
                            return (
                                <li className="nav-item" >
                                    <button className="nav-link btn-lg" name="filterStore" value={item.storeName} data-toggle="tab" role="tab" aria-controls="ready" aria-selected="false" onClick={this.handleChange}>{item.storeName}</button>
                                </li>
                            )
                        }) 
                        : null}
                    </ul>
                </div>
            </div>
            <div className="Shopping-cart-area pt-30 pb-30">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8 col-xs-12">
                            <form>
                                <div className="table-content table-responsive">
                                    <table className="table">
                                    <thead>
                                        <tr>
                                        <th className="li-product-remove">Action</th>
                                        <th className="li-product-thumbnail">Image</th>
                                        <th className="cart-product-name">Product</th>
                                        <th className="li-product-price">Unit Price</th>
                                        <th className="li-product-quantity">Quantity</th>
                                        <th className="li-product-available">Available</th>
                                        <th className="li-product-subtotal">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {
                                        this.showItem(items)
                                        } */}
                                        {items && items.length && filterStore == 'All' ? items.map((item,index) => {
                                            {/* console.log('all',item) */}
                                            return (
                                                <tr>
                                                    <td className="li-product-remove"><Link to="#"><i style={{fontSize: 20}} 
                                                    onClick={() => this.removeItem(item)} 
                                                    className="fa fa-trash" /></Link></td>
                                                    <td className="li-product-thumbnail d-flex justify-content-center"><a href="/">
                                                    <div className="fix-cart"> <img className="fix-img" src={item.image ?  item.image : null} alt="Li's Product" /></div>
                                                    </a></td>
                                                    <td className="li-product-name"><a className="text-dark" href="/">{item.nameProduct}</a></td>
                                                    <td className="product-subtotal"><span className="amount">{formatNumber.format(item.price)}</span></td>
                                                    <td className="quantity">
                                                    <div className="cart-plus-minus">
                                                        <input onChange={() => { }} className="cart-plus-minus-box" value={item.quantity || 0} />
                                                        <div onClick={() => this.downItem(item)} className="dec qtybutton"><i className="fa fa-angle-down" />
                                                        </div>
                                                        <div onClick={() => this.upItem(item)} className="inc qtybutton"><i className="fa fa-angle-up" /></div>
                                                    </div>
                                                    </td>
                                                    <td className='number-Available'><span className="amount">{item.numberAvailable}</span></td>
                                                    <td className="product-subtotal"><span className="amount">{formatNumber.format(item.price * item.quantity)}</span></td>
                                                </tr>
                                            )
                                        })
                                        :null}

                                        {getsuggestion[0] && getsuggestion[0].length && filterStore !== 'All' ? getsuggestion[0].filter((items,index) => {
                                            return items.storeName == filterStore}).map((items,index) => {
                                                console.log('items', items)
                                                let newitem = items.suggestionList
                                                return newitem.map((object) => {
                                                    {/* console.log('object', object.product) */}
                                                    return (
                                                        <tr>
                                                            <td className="li-product-remove"><Link to="#"><i style={{fontSize: 20}} 
                                                            // onClick={() => this.removeItem(object)} 
                                                            className="fa fa-trash" /></Link></td>
                                                            <td className="li-product-thumbnail d-flex justify-content-center"><a href="/">
                                                            <div className="fix-cart"> <img className="fix-img" src={object.product.image ?  object.product.image : null} alt="Li's Product" /></div>
                                                            </a></td>
                                                            <td className="li-product-name"><a className="text-dark" href="/">{object.product.nameProduct}</a></td>
                                                            <td className="product-subtotal"><span className="amount">{formatNumber.format(object.product.price)}</span></td>
                                                            <td className="quantity">
                                                            <div className="cart-plus-minus">
                                                                <input onChange={() => { }} className="cart-plus-minus-box" disabled value={object.quantity || 0} />
                                                            </div>
                                                            </td>
                                                            <td className='number-Available'><span className="amount">{object.product.numberAvailable}</span></td>
                                                            <td className="product-subtotal"><span className="amount">{formatNumber.format(object.product.price * object.quantity)}</span></td>
                                                        </tr>
                                                    )
                                                    
                                                })
                                            })
                                            
                                             : null }
                                    </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>
                    <div className="col-sm-4 col-xs-12">
                        {/* <SumTotal></SumTotal> */}
                        <div>
                            <div className="cart-page-total">
                            <h2>Cart totals</h2>
                            <ul>
                                <li>Subtotal <span>{amount ? formatNumber.format(amount) : 0}</span></li>
                                <li>Shipping <span>{formatNumber.format(amount ? shippingTotal : 0)}</span></li>
                                <li style={{ color: 'red' }}>Total <span>{amount ? formatNumber.format(amount + shippingTotal) : 0}</span></li>
                            </ul>
                            <button onClick={() => this.checkAuthenticate()} className="fix-text-checkout">Order Now</button>
                            <button onClick={() => {console.log('Order All')}} className="fix-text-checkout" >Order All</button>
                            </div>
                            <div className="coupon-all">
                            <div className="coupon">
                                <input id="coupon_code" className="input-text" name="coupon_code" placeholder="Code..." type="text" />
                                <input className="button" name="apply_coupon" type="submit" />
                                <span className="fix-text-discount">Discount Code / Gifts</span>
                                
                            </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
  }
}

const mapStateToProps = (state) => {
    console.log('state', state)
  return {
    items: state.cart,
    user: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_items: () => {
      dispatch(actFetchCartRequest())
    },
    removeItem: (item) => {
        dispatch(actRemoveCartRequest(item))
    },
    changQuantityItem: (item) => {
        dispatch(actUpdateCartRequest(item))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuggestionCart)
