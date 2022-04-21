import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProductsRequest, actDeleteProductRequest, actFindProductsRequest } from '../../../redux/actions/product';
import {actGetManyDiff, actCreateExchange } from '../../../redux/actions/exchange';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import Paginator from 'react-js-paginator';
import callApi from '../../../utils/apiCaller';
import Modal from 'react-bootstrap/Modal'
import RequestCartItems from './RequestCartItems'
import { actFetchCartRequest } from '../../../redux/actions/cart';

const MySwal = withReactContent(Swal)

let token, items;

class RequestCart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      currentPage: 1,
      searchText: '',
      modalShow: false,
      productName : '',
      selected:'',
      quantity: '',
      user: [],
      recUser: '',
    //   userdiff: []
    }
  }

  async componentDidMount() {
    token = localStorage.getItem('_auth');
    if (token) {
      const res = await callApi('users/me', 'GET', null, token);
      if (res && res.status === 200) {
        this.setState({
          user: res.data.results
        })
      }

      const res2 = await callApi(`admindiff/${this.state.user[0].id}`, 'GET', null, token);  
        if (res2 && res2.status === 200) {
          this.setState({
            userdiff: res2.data
          })
          // console.log("test" , this.state.userdiff)
          this.setState({
            recUser: this.state.userdiff[0] ? this.state.userdiff[0].name : null
          })
          
          
          // console.log("recuser" , this.state.recUser)
        }
    } else {
      this.setState({
        redirect: true
      })    
    }
    
    // await this.fetch_reload_data();
    await this.props.fetch_items(); 
  }

  fetch_reload_data(){
    token = localStorage.getItem('_auth');
    this.props.fetch_items().then(res => {
      console.log('reload data')
    }).catch(err => {
      console.log(err);  
    })

  
  }


  pageChange(content){
    const limit = 10;
    const offset = limit * (content - 1);
    this.props.fetch_products(token, offset);
    this.setState({
      currentPage: content
    })
    window.scrollTo(0, 0);
  }


  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { searchText } = this.state;
    this.props.find_products(token, searchText).then(res => {
      this.setState({
        total: res.total
      })
    })
  }

  createExchange = (payload) => {
    token = localStorage.getItem('_auth');
    this.props.create_exchange(token, payload).then(res => {
      console.log(res)
    })
    localStorage.removeItem('_cart');
    this.setState({modalShow: false})
  }

  showItem(items) {
    let result = null;
    if (items.length > 0) {
      result = items.map((item, index) => {
        if(item.quantity){
            return (
                <RequestCartItems key={index} item={item} quantityTest={item.quantity}></RequestCartItems>
            );
        }
      });
    }
    return result;
  }


  render() {
    const { products } = this.props;
    items = JSON.parse(localStorage.getItem('_cart'));
    // items.map((item,index) => {
    //     console.log('test', item.nameProduct)
    // });
    let multiRequestCart = [];
    if(items){
        for(let i = 0 ; i < items.length; i++){
            multiRequestCart.push({ pName: items[i].nameProduct,quantity: items[i].quantity})
        }
        // console.log('multiRequestCart',multiRequestCart)
    }
    // const {items} = this.props;
    const { searchText, total } = this.state;
    // console.log('request cart props', this.props)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Products</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Request Cart</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Request Cart</h3>
                  </div>
                  <form onSubmit={(event) => this.handleSubmit(event)}
                    className="form-inline md-form form-sm mt-0" style={{ justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20 }}>
                  </form>
                  <div className="card-body" style={{width:'100%'}}>
                    <div className="Shopping-cart-area pt-30 pb-30">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-8 col-xs-12">
                                <form>
                                    {/* <div className="table-content table-responsive"> */}
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th className="li-product-remove">Action</th>
                                            <th className="li-product-thumbnail">Image</th>
                                            <th className="cart-product-name">Product</th>
                                            {/* <th className="li-product-price">Unit Price</th> */}
                                            <th className="li-product-quantity">Quantity</th>
                                            {/* <th className="li-product-subtotal">Total</th> */}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            items ? this.showItem(items) : null
                                        }
                                        </tbody>
                                    </table>
                                    {/* </div> */}
                                </form>
                                </div>
                                <div className="col-sm-4 col-xs-12">
                                    <div className="cart-page-total">
                                        <h2>Cart totals</h2>
                                        <div className="form-group">
                                            <label style={{"margin-top":"20px"}} htmlFor="name">Request To </label>
                                            <br />
                                            <select id="select" name="select"
                                            // onChange={this.handleChange} 
                                            onChange={(e) => {
                                                this.setState({recUser : e.target.value})
                                            }}
                                            >
                                                {this.state.userdiff && this.state.userdiff.length ?
                                                this.state.userdiff.map((item, index) => {
                                                    return(
                                                    <option key={index} value={item.name} >{item.name}</option>
                                                    )
                                                })
                                                : null
                                                }
                                            </select>
                                        </div>      
                                        <ul>
                                            {/* <li>Subtotal <span>{amount ? formatNumber.format(amount) : 0}</span></li> */}
                                            {/* <li>Shipping <span>{formatNumber.format(amount ? shippingTotal : 0)}</span></li> */}
                                            {/* <li style={{ color: 'red' }}>Total <span>{amount ? formatNumber.format(amount + shippingTotal) : 0}</span></li> */}
                                        </ul>
                                        <button type="button" className="form-control btn btn-primary" onClick={() => 
                                            this.createExchange({
                                            reqUserName:this.state.user[0].name,
                                            recUserName:this.state.recUser,
                                            multiRequest: multiRequestCart
                                            })
                                        }>
                                            Request Now
                                        </button>
                                    </div>
                                </div>   
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
                <nav aria-label="Page navigation example" style={{ float: "right" }}>
                  <ul className="pagination">
                    <Paginator
                        pageSize={10}
                        totalElements={total}
                        onPageChangeCallback={(e) => {this.pageChange(e)}}
                      />
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </section>
        {/* Page Footer*/}
        <MyFooter></MyFooter>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_products: (token, offset) => {
       return dispatch(actFetchProductsRequest(token, offset))
    },
    delete_product: (id, token) => {
      dispatch(actDeleteProductRequest(id, token))
    },
    find_products: (token, searchText) => {
      return dispatch(actFindProductsRequest(token, searchText))
    },
    getmany_diff: (id, token) => {
      return dispatch(actGetManyDiff(id, token))
    },
    fetch_items: () => {
        dispatch(actFetchCartRequest())
    },
    create_exchange: (token, payload) => {
        return dispatch(actCreateExchange(token, payload))
    }, 
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(RequestCart)