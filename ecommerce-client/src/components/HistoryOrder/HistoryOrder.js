import React, { Component } from 'react'
import { connect } from 'react-redux'
import callApi from '../../utils/apiCaller';
import { Link } from 'react-router-dom'
import Moment from 'react-moment';
import { formatNumber } from '../../config/TYPE'
import './style.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

let token;

class HistoryOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
          historyBooking: [],
          modalShow: false,
          filterStatus: 'All',
        }
    }

    async componentDidMount() {
        token = localStorage.getItem('_auth');
        const res = await callApi('users/me', 'GET', null, token);
        const res2 = await callApi('users/me/historyBooking', 'GET', null, token);
        this.setState({
          historyBooking: res2.data.results
        })
        console.log(res2.data.results)
    }

    showOrder(status){
        if (status === 'Unconfirm') { 
          return (<div className="col-md-auto"><label className="fix-status" style={{background: '#ff9800', textAlign: "center"}} >{status}</label></div>)
        
        }
        if (status === 'Confirm') {
          return (
            <div className="col-md-auto"><label className="fix-status" style={{background: '#337ab7', textAlign: "center"}} >{status}</label></div>
          )
         
        }
        if (status === 'Shipping') {
          return (
       <div className="col-md-auto"><label className="fix-status" style={{background: '#634a41', textAlign: "center"}} >{status}</label></div>
          )
          
        }
        if (status === 'Complete') {
          return (
            <div className="col-md-auto"><label className="fix-status" style={{background: '#5cb85c', textAlign: "center"}} >{status}</label></div>
          )
         
        }
        if (status === 'Canceled') {
          return (
            <div className="col-md-auto"><label className="fix-status" style={{background: '#d9534f'}} >{status}</label></div>
          )
         
        }
    }

    cancelOrder = (id) =>{
        MySwal.fire({
          title: 'Are you sure?',
          text: "You won't be able to cancel this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Cancel it!'
        }).then(async (result) => {
          if (result.value) {
            const res = await callApi(`users/order/${id}/cancel`, 'PUT', null, token);
          if(res && res.status === 200) {
            const res2 = await callApi('users/me/historyBooking', 'GET', null, token);
            this.setState({
              historyBooking: res2.data.results
            })
            Swal.fire(
              'Canceled!',
              'Your order has been Canceled.',
              'success'
            )
          }
          }
        })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log(name, value)
        this.setState({
          [name]: value
        });
    }

  render() {
    // const { products } = this.props;
    const { historyBooking } = this.state;
    return (
        <div>
            <div className='container'>
                <div className="row justify-content-md-center">
                    <ul className="nav nav-tabs" style={{ paddingTop: 30, marginLeft: 100}} id="myTab" role="tablist">
                        <li className="nav-item">
                            <button className="nav-link active btn-lg" name="status" value="All" data-toggle="tab" role="tab" aria-controls="all" aria-selected="true" onClick={this.handleChange}>ALL</button>
                            {/* <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="all" aria-selected="true">All</a> */}
                        </li>
                        <li className="nav-item" style={{marginLeft: 10}}>
                            <button className="nav-link btn-lg" name="filterStatus" value="Unconfirm" data-toggle="tab" role="tab" aria-controls="ready" aria-selected="false" onClick={this.handleChange}>UNCONFIRM</button>
                        </li>
                        <li className="nav-item" style={{marginLeft: 10}}>
                            <button className="nav-link btn-lg" name="filterStatus" value="Confirm" data-toggle="tab" role="tab" aria-controls="ready" aria-selected="false" onClick={this.handleChange}>CONFIRM</button>
                        </li>
                        <li className="nav-item" style={{marginLeft: 10}}>
                            <button className="nav-link btn-lg" name="filterStatus" value="Shipping" data-toggle="tab" role="tab" aria-controls="shipping" aria-selected="false" onClick={this.handleChange}>SHIPPING</button>
                        </li>
                        <li className="nav-item" style={{marginLeft: 10}}>
                            <button className="nav-link btn-lg" name="filterStatus" value="Complete" data-toggle="tab" role="tab" aria-controls="complete" aria-selected="false" onClick={this.handleChange}>COMPLETE</button>
                        </li>
                        <li className="nav-item" style={{marginLeft: 10}} >
                            <button className="nav-link btn-lg" name="filterStatus" value="Canceled" data-toggle="tab" role="tab" aria-controls="cancel" aria-selected="false" onClick={this.handleChange}>CANCEL</button>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="Shopping-cart-area pt-30 pb-30">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 col-xs-12">
                            <form>
                            <div className="table-content table-responsive">
                                <table className="table" style={{ textAlign: "center" }}>
                                <thead>
                                    <tr>
                                    <th className="li-code-order">Code Order</th>
                                    <th className="li-view-detail-order">View</th>
                                    <th className="date-order">Date Order</th>
                                    <th className="li-status">Status</th>
                                    <th className="li-total-amount">Total Amount</th>
                                    <th className="li-order-remove">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {products && products.length ? products.map((item, index) => {
                                    return (
                                        <ProductFavoriteItem key={index} value={index} product={item}></ProductFavoriteItem>
                                    )
                                    }) : null} */}
                                    {
                                        historyBooking && historyBooking.length ? historyBooking
                                        .filter((item,index) => {
                                            if(this.state.filterStatus === 'All'){
                                            return true
                                            }
                                            return item.status == this.state.filterStatus
                                        })
                                        .map((item, index) => {
                                        return (
                                            <tr key={index} id="myrow">
                                                <th><Link to="/orders/history/item">#{item.id}</Link></th>
                                                <th><button type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    View
                                                    </button>
                                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        <table className="table table-hover" style={{ textAlign: "center" }}>
                                                            <thead>
                                                                <tr>
                                                                <th style={{width:'30%'}}>Number</th>
                                                                <th>Name Product</th>
                                                                <th>Price</th>
                                                                <th>Quantity</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {item.orderDetails && item.orderDetails.length ? item.orderDetails.map((order,index) => {
                                                                {/* console.log('item',order) */}
                                                                return(
                                                                    <tr key = {index}>
                                                                    <td scope="row">{index + 1}</td>
                                                                    <td><span className="text-truncate" style={{width:'100%'}} >{order.nameProduct}</span></td>
                                                                    <td>{order.price}</td>
                                                                    <td>{order.quantity}</td>
                                                                    </tr>

                                                                )
                                                                }) : null }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </th>
                                                <th><Moment format="DD-MM-YYYY">
                                                    {Date(item.createdAt)}
                                                    </Moment>
                                                </th>
                                                <th>
                                                    {this.showOrder(item.status)}
                                                </th>
                                                <th>
                                                    {formatNumber.format(item.totalAmount)}
                                                </th>
                                                <th><Link to="#" onClick={(id)=>this.cancelOrder(item.id)} style={{ backgroundColor: '#ffff', border: '#ffff' }}><i className="fa fa-window-close" style={{color: 'red', fontSize: 15}}></i></Link></th>
                                            </tr>
                                            
                                        )
                                        }) : null                   
                                    }
                                </tbody>
                                </table>
                            </div>
                            </form>
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
    products: state.favorites
  }
}

export default connect(mapStateToProps, null)(HistoryOrder)
