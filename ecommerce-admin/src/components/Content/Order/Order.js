import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchOrdersRequest, actDeleteOrderRequest, actFindOrdersRequest, actFindOrderProductDetail } from '../../../redux/actions/order';
import Swal from 'sweetalert2'
import Moment from 'react-moment';
import withReactContent from 'sweetalert2-react-content'
import MyFooter from '../../MyFooter/MyFooter'
import Paginator from 'react-js-paginator';
import {exportExcel} from '../../../utils/exportExcel'
import callApi from '../../../utils/apiCaller';
import { toast } from "react-toastify";
import Modal from 'react-bootstrap/Modal'
import RangePicker from 'react-range-picker'
const MySwal = withReactContent(Swal)

let token;

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      total: 0,
      total2:0,
      currentPage: 1,
      user: [],
      filterStatus: 'All',
      productDetails: 0,
      modalShow: false,
      Newest : 'Newest',
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
        // console.log("user",this.state.user[0].name)
      }
    } else {
      this.setState({
        redirect: true
      })    
    }
    await this.fetch_reload_data(); //recive data from return promise dispatch
  }

  async fetch_reload_data(){
    token = localStorage.getItem('_auth');
    this.props.fetch_orders(token, null, this.state.user[0].name).then(res => {
      console.log(res)
      let res2 = res.results.sort((a,b)=> {
        return new Date(a.createdAt) < new Date(b.createdAt)
      })
      this.setState({
        total: res.results.sort((a,b)=> {
          return new Date(a.createdAt) < new Date(b.createdAt)
        })
      });
    }).catch(err => {
      console.log(err);  
    })
  }

  pageChange(content){
    const limit = 10;
    const offset = limit * (content - 1);
    this.props.fetch_orders(token, offset);
    this.setState({
      currentPage: content
    })
    window.scrollTo(0, 0);
  }

  handleRemove = (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        const res = await this.props.delete_order(id, token);
        if(res && res.status == 200){
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
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
    console.log(event)
    this.setState({
      [name]: value
    });
  }

  // handleSubmit = (event) => {
  //   event.preventDefault();
  //   const { searchText } = this.state;
  //   this.props.find_order(token, searchText).then(res => {
  //     this.setState({
  //       total: res.total
  //     }) 
  //   })
  // }

  filterText = (event) => {
    const keyword = event.target.value
    this.setState({
      searchText: keyword
    });
    if(keyword !== ''){
      // console.log(this.state.total)
      const result = this.state.total.filter((item)=> {
        return item.fullName.toLowerCase().startsWith(keyword.toLowerCase());
      })
      this.setState({
        total: result,
        // total2: result.slice(0,10)
      })
    }
    else{
      this.fetch_reload_data()
    }
  }

  downloadExcel = () => {
    const key = 'orders'
    exportExcel(key)
  }

  showOrder(status){
    if (status === 'Unconfirm') { 
      return (<div className="col-md-3"><label className="fix-status" style={{background: '#ff9800'}} >{status}</label></div>)
    
    }
    if (status === 'Confirm') {
      return (
        <div className="col-md-3"><label className="fix-status" style={{background: '#337ab7'}} >{status}</label></div>
      )
     
    }
    if (status === 'Shipping') {
      return (
   <div className="col-md-3"><label className="fix-status" style={{background: '#634a41'}} >{status}</label></div>
      )
      
    }
    if (status === 'Complete') {
      return (
        <div className="col-md-3"><label className="fix-status" style={{background: '#5cb85c'}} >{status}</label></div>
      )
     
    }
    if (status === 'Canceled') {
      return (
        <div className="col-md-3"><label className="fix-status" style={{background: '#d9534f'}} >{status}</label></div>
      )
     
    }
  }

  async handleChangeStatus(payload){
    token = localStorage.getItem('_auth');
    const res = await callApi('order/changestatus',"POST", payload, token)
    if (res && res.status === 200) {
      return toast.success(res.data);
    }
    this.fetch_reload_data()
  }

  async fetch_product_details_Order(item){
    // console.log('fetch thanh cong', id)
    token = localStorage.getItem('_auth');
    console.log(item)
    // if (item.status === 'Complete' || item.status == 'Shipping' || item.status === 'Processing'){
      await this.props.find_order_product_detail(token, item.id).then(res => {
        this.setState({
          productDetails : res,
          modalShow : true,
        })
      })
    // }
    
    // console.log('key',this.state.productDetails)
  }

  MyVerticallyCenteredModal = (props) => {
    let temp = Object.keys(this.state.productDetails)
    let detail;
    // console.log('key',temp)
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            ID Product details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflow: 'auto'}}>
          
          {/* {console.log('test',this.state.productDetails)} */}
          <div >
            <form >
              <div className="table-responsive">
                <table className="table table-hover" style={{ textAlign: "center" }}>
                  <thead>
                    <tr>
                      {/* <th style={{width:'30%'}}>Number</th> */}
                      <th>Id-product</th>
                      <th>Name Product</th>
                      <th>Image</th>
                      <th>Quantity</th>
                      <th>ids</th>
                    </tr>
                  </thead>
                  <tbody>
                    {temp ? temp.map((item,index)=>{
                      {/* console.log(this.state.productDetails[item]) */}
                      detail = this.state.productDetails[item]
                      {/* console.log('detail',detail) */}
                      return (
                        <tr key = {index}>
                          {/* <td scope="row">{index + 1}</td> */}
                          <td><span className="text-truncate" >{detail.product.id}</span></td>
                          <td><span className="text-truncate" >{detail.product.nameProduct}</span></td>
                          <td>
                              <div className="fix-cart">
                                <img src={detail.product.image ? detail.product.image : null} className="fix-img" alt="not found" />
                              </div>
                            </td>
                          <td><span className="text-truncate" >{detail.quantity}</span></td>
                          <td><span className="text-truncate" >{detail.ids}</span></td>
                        </tr>)
                    }): null}
                  </tbody>
                </table>
              </div>
            </form>
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <button type="button" class="btn btn-info" onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    // this.fetch_reload_data()
    const  orders = this.state.total;
    const { searchText, total } = this.state;
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Orders</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Orders</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Data Table Orders</h3>
                    <button onClick={()=>this.downloadExcel()} style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                        style={{fontSize: 18, color: '#1d7044'}}> Excel</i></button>
                  </div>
                  <div>
                    
                    </div>
                  <div style={{witdh:"30px", justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20, marginLeft:"auto" }} class="btn-group">
                  {/* <RangePicker
                    dateFormat='dd/MM/yyyy'
                    isClearable={true}
                    placeholder='Date...'
                  /> */}
                  <select className="form-control mb-3" name="sotring" onChange={(event) => {this.setState({ total : total.reverse()})}} >
                      <option value='Newest'>Newest</option>
                      <option value='Oldest'>Oldest</option>
                    </select>     
                  <select className="form-control mb-3" name="status" onChange={(event) => {
                                                                // this.setState({
                                                                //   filterStatus : event.target.value}
                                                                // )
                                                                this.state.filterStatus = event.target.value
                                                                this.fetch_reload_data()
                                                              }} >
                      <option value='All'>All</option>
                      <option value='Processing' >Processing</option>
                      {/* <option value='Confirm'>Confirm</option> */}
                      <option value='Shipping' >Shipping</option>
                      <option value='Complete' >Complete</option>
                      <option value='Canceled' >Cancel</option>
                    </select>      
                      <input
                        name="searchText"
                        onChange={this.filterText}
                        value={searchText}
                        className="form-control form-control-sm ml-3 w-75" type="text" 
                        placeholder="Search by Name ..."
                        aria-label="Search" />
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover" style={{ textAlign: "center" }}>
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>Name</th>
                            {/* <th>Address</th> */}
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Paid</th>
                            <th>Ids</th>
                            {/* <th style={{ textAlign: "center" }}>Payment Online</th> */}
                            <th>Item Amount</th>
                            <th>Shipping Total</th>
                            {/* <th>Promo Total </th> */}
                            <th>Desired time</th>
                            <th>Total Amount</th>
                            <th>Note</th>
                            <th>Code</th>
                            <th>Created At</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <this.MyVerticallyCenteredModal
                                  show={this.state.modalShow}
                                  onHide={() => this.setState({modalShow: false})}
                                />
                          {orders && orders.length ? orders
                          .filter((item,index) => {
                            if(this.state.filterStatus === 'All'){
                              return true
                            }
                            return item.status == this.state.filterStatus
                          })
                          .map((item, index) => {
                            {/* console.log('order',item) */}
                            return (
                              <tr key={index} 
                              >
                                <th scope="row">{index + 1}</th>
                                <td>{item.fullName}</td>
                                {/* <td>{item.address}</td> */}
                                <td>{item.phone}</td>
                                {/* <td>{this.showOrder(item.status)} </td> */}
                                <td>
                                  <select  className="form-control mb-3" value={item.status} name="status" onChange={(event) => {
                                                                                                              item.status = event.target.value
                                                                                                              const name = event.target.name
                                                                                                              this.setState({
                                                                                                                [name] : event.target.value
                                                                                                              })
                                                                                                              this.handleChangeStatus({
                                                                                                                orderId: item.id,
                                                                                                                status: event.target.value,
                                                                                                                atStore: item.atStore,
                                                                                                                fullName: item.fullName
                                                                                                                })
                                                                                                            }} >
                                    <option value='Processing'>Processing</option>
                                    <option value='Shipping' >Shipping</option>
                                    <option value='Complete' >Complete</option>
                                    <option value='Canceled' >Cancel</option>
                                  </select>
                                </td>
                                {/* {console.log(item.status)} */}
                                <td>{item.isPaid ?
                                  <div className="i-checks">
                                    <input type="checkbox" onChange={()=>{}} checked={true} className="checkbox-template" />
                                  </div>
                                  :
                                  <div className="i-checks">
                                    <input type="checkbox" onChange={()=>{}} checked={false} className="checkbox-template" />
                                  </div>}
                                </td>
                                <td>
                                  <button type="button" className='btn btn-light' onClick={()=>{ 
                                    this.fetch_product_details_Order(item)
                                    // console.log('onclick')
                                    }}>View</button>
                                </td>
                                {/* <td style={{ textAlign: "center" }}>{item.isPaymentOnline ?
                                  <div className="i-checks">
                                    <input type="checkbox" onChange={()=>{}} checked={true} className="checkbox-template" />
                                  </div>
                                  :
                                  <div className="i-checks">
                                    <input type="checkbox" onChange={()=>{}} checked={false} className="checkbox-template" />
                                  </div>}
                                </td> */}
                                <td>{item.itemAmount}</td>
                                <td>{item.shippingTotal}</td>
                                <td>{item.promoTotal}</td>
                                <td>{item.totalAmount.toFixed(3)}</td>
                                <td><p>{item.note}</p></td>
                                <td>{item.id}</td>
                                <td>
                                  <Moment format="DD/MM/YYYY">
                                    {Date(item.createdAt)}
                                  </Moment>
                                </td>
                                <td>
                                  <div>
                                    <span title='Edit' className="fix-action"><Link to={`/orders/edit/${item.id}`}> <i className="fa fa-edit"></i></Link></span>
                                    <span title='Delete' onClick={() => this.handleRemove(item.id)} className="fix-action"><Link to="#"> <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></Link></span>
                                  </div>
                                  <div>
                                    {/* {console.log('statuts',item.status)} */}
                                  </div>
                                </td>
                              </tr>
                            )
                          }) : null}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <nav aria-label="Page navigation example" style={{ float: "right" }}>
                  <ul className="pagination">
                  <Paginator
                        pageSize={10}
                        totalElements={total.length}
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
  // console.log
  return {
    orders: state.orders
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_orders: (token, offset, storename) => {
      return dispatch(actFetchOrdersRequest(token, offset, storename))
    },
    delete_order: (id, token) => {
      dispatch(actDeleteOrderRequest(id, token))
    },
    find_order: (token, searchText) => {
      return dispatch(actFindOrdersRequest(token, searchText))
    },
    find_order_product_detail:(token, id) => {
      return dispatch(actFindOrderProductDetail(token, id))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order)
