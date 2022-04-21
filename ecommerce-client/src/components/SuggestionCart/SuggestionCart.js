import React, { Component } from 'react'
import ShoppingCartItems from './ShoppingCartItems'
import { actFetchCartRequest } from '../../redux/actions/cart';
import { connect } from 'react-redux'
import SumTotal from './SumTotal';
import callApi from "../../utils/apiCaller";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom'
import { formatNumber } from '../../config/TYPE'
import { actRemoveCartRequest, actUpdateCartRequest } from '../../redux/actions/cart';

let token
class SuggestionCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterStore: 'All',
            getsuggestion:'',
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
        // console.log('getsuggestion', this.state.getsuggestion)
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

  render() {
    const { items } = this.props;
    const { getsuggestion , filterStore } = this.state;
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
                                        {items && items.length ? items.map((item,index) => {
                                            console.log(item)
                                            return (
                                                <tr>
                                                    <td className="li-product-remove"><Link to="#"><i style={{fontSize: 20}} onClick={() => this.removeItem(item)} className="fa fa-trash" /></Link></td>
                                                    <td className="li-product-thumbnail d-flex justify-content-center"><a href="/">
                                                    <div className="fix-cart"> <img className="fix-img" src={item.image ?  item.image : null} alt="Li's Product" /></div>
                                                    </a></td>
                                                    <td className="li-product-name"><a className="text-dark" href="/">{item.nameProduct}</a></td>
                                                    <td className="product-subtotal"><span className="amount">{formatNumber.format(item.price)}</span></td>
                                                    <td className="quantity">
                                                    {filterStore == 'All' ? 
                                                    <div className="cart-plus-minus">
                                                        <input onChange={() => { }} className="cart-plus-minus-box" value={item.quantity || 0} />
                                                        <div onClick={() => this.downItem(item)} className="dec qtybutton"><i className="fa fa-angle-down" />
                                                        </div>
                                                        <div onClick={() => this.upItem(item)} className="inc qtybutton"><i className="fa fa-angle-up" /></div>
                                                    </div>
                                                    : 
                                                    <div className="cart-plus-minus">
                                                        <input onChange={() => { }} className="cart-plus-minus-box" disabled value={item.quantity || 0} />
                                                        {/* <div onClick={() => this.downItem(item)} className="dec qtybutton"><i className="fa fa-angle-down" />
                                                        </div>
                                                        <div onClick={() => this.upItem(item)} className="inc qtybutton"><i className="fa fa-angle-up" /></div> */}
                                                    </div>
                                                    }
                                                    
                                                    </td>
                                                    <td className='number-Available'><span className="amount">{item.numberAvailable}</span></td>
                                                    <td className="product-subtotal"><span className="amount">{formatNumber.format(item.price * item.quantity)}</span></td>
                                                </tr>
                                            )
                                        }): null}
                                        
                                    </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>
                    <div className="col-sm-4 col-xs-12">
                        <SumTotal></SumTotal>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.cart
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
