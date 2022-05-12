import React, { Component } from 'react'
// import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {actGenerateRouting , actClearRequest} from '../../../redux/actions/routing';
import { actFindOrderProductDetail } from '../../../redux/actions/order';
import { actFetchProductDetail} from '../../../redux/actions/exchange';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import callApi from '../../../utils/apiCaller';
import Map from './Map'
import Paginator from 'react-js-paginator';
import { toast } from "react-toastify";
import Modal from 'react-bootstrap/Modal'

// import "antd/dist/antd.css"

const MySwal = withReactContent(Swal)

let token;
class Routing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: [],
      currentPage: 1,
      modalShow: false,
      user: [],
      listRouting: [],
      listComplete: [],
      listCancel : [],
      prove: [],
      productDetails:"",
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
    } else {
      this.setState({
        redirect: true
      })    
    }
    // await this.fetch_reload_data(); 
  }

  // fetch_reload_data(){
  //   token = localStorage.getItem('_auth');
  //   this.props.tracking_request(this.state.searchText,token).then(res => {
  //     this.setState({
  //       total: res
  //     });
  //   }).catch(err => {
  //     console.log(err);  
  //   })
  
  // }

  async handleChangeStatus(payload){
    token = localStorage.getItem('_auth');
    const res = await callApi('order/changestatus',"POST", payload, token)
    if (res && res.status === 200) {
      return toast.success(res.data);
    }
    // this.fetch_reload_data()
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

handleSubmit = async (event) => {
    event.preventDefault();
    token = localStorage.getItem('_auth');
    const { user } = this.state;
    // console.log('user', user[0].name)
    let storeName = user[0].name;
    // const res = await this.props.generate_routing(storeName,token)
    // console.log('res',res)

    await this.props.generate_routing(storeName, token).then(res => {
      console.log('res',res)
      this.setState({
        listRouting : res[0], 
        listComplete : res[0].filter((item) => { return item.specialId != null}),
        prove:res[1]
      })
    })
    // const res = await callApi('routing/${storeName}', 'GET', null, token);
  
  }

  handleFinishRouting = async () => {
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
        // eslint-disable-next-line no-unused-expressions
          this.state.listComplete && this.state.listComplete.length ? this.state.listComplete.map((item) => {
            let keyword = item.specialId.split("-");
            console.log(keyword)
            if(keyword[0] == "O"){
              let payload = {
                orderId : item.id,
                status:"Complete",
                atStore : this.state.user[0].name,
                fullName : item.fullName
              }
              callApi('order/changestatus',"POST", payload, token).then( (res) => {
                if (res && res.status === 200) {
                  toast.success('Order: {'+ item.specialId +'} has been complete.');
                }else {
                  toast.success('Order: {'+ item.specialId +'} have somethings wrong.');
                }
              })
            }
            if(keyword[0] == "E"){
              let payload = {
                id : item.id,
                status:"Complete",
                // atStore : this.state.user[0].name,
                // fullName : item.fullName
              }
              callApi('exchange/changeStatus',"POST", payload, token).then( (res) => {
                if (res && res.status === 200) {
                  toast.success('Exchange: {'+ item.specialId +'} has been complete.');
                }else {
                  toast.success('Exchange: {'+ item.specialId +'} have somethings wrong.');
                }
              })
            }
            
            
          }
          ):null
          // eslint-disable-next-line no-unused-expressions
          this.state.listCancel && this.state.listCancel.length ? this.state.listCancel.map((item) => {
            let keyword = item.specialId.split("-");
            console.log(keyword)
            if(keyword[0] == "O"){
              let payload = {
                orderId : item.id,
                status:"Failed",
                atStore : this.state.user[0].name,
                fullName : item.fullName
              }
              callApi('order/changestatus',"POST", payload, token).then( (res) => {
                if (res && res.status === 200) {
                  toast.success('Order: {'+ item.specialId +'} has Failed.');
                }else {
                  toast.success('Order: {'+ item.specialId +'} have somethings wrong.');
                }
              })
            }
            if(keyword[0] == "E"){
              let payload = {
                id : item.id,
                status:"Failed",
                // atStore : this.state.user[0].name,
                // fullName : item.fullName
              }
              callApi('exchange/changeStatus',"POST", payload, token).then( (res) => {
                if (res && res.status === 200) {
                  toast.success('Exchange: {'+ item.specialId +'} has Failed.');
                }else {
                  toast.success('Exchange: {'+ item.specialId +'} have somethings wrong.');
                }
              })
            }
            
          }
          ):null
        // console.log('finish')
        const res = await this.props.clear_Routing();
      }
      
    })
  }

  handleStartRouting = async () => {
    const { routing } = this.props
    MySwal.fire({
      title: 'Are you sure?',
      text: "These orders status will change to shipping!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
          // this.state.listRouting && this.state.listRouting.length ? this.state.listRouting.filter((item) => {
          //   return item.specialId != null
          // })
          // eslint-disable-next-line no-unused-expressions
          routing && routing ? routing.filter((item) => {
            return item.specialId != null
          })
          .map((item) => {
            
            // const res = await callApi('order/changestatus',"POST", payload, token);
            // if (res && res.status === 200) {
            //   toast.success('Order: {'+ item.specialId +'} is shipping.');
            // }
            let keyword = item.specialId.split("-");
            console.log(keyword)
            if(keyword[0] == "O"){
              let payload = {
                orderId : item.id,
                status:"Shipping",
                atStore : this.state.user[0].name,
                fullName : item.fullName
              }
              callApi('order/changestatus',"POST", payload, token).then(async (res) => {
                if (res && res.status === 200) {
                  toast.success('Order: {'+ item.specialId +'} is shipping.');
                }
              })
            }
            if(keyword[0] == "E"){
              let payload = {
                id : item.id,
                status:"Shipping",
                // atStore : this.state.user[0].name,
                // fullName : item.fullName
              }
              callApi('exchange/changeStatus',"POST", payload, token).then(async (res) => {
                if (res && res.status === 200) {
                  toast.success('Order: {'+ item.specialId +'} is shipping.');
                }
              })
            }
            else {
              toast.success('Order: {'+ item.specialId +'} have somethings wrong.');
            }
          }
          ):null
      }
    })
  }

  async fetch_product_details(item){
    // console.log('fetch thanh cong', id)
    token = localStorage.getItem('_auth');
    console.log("item",item)
    let keyword = item.specialId.split("-");
    console.log('key',keyword)
    if(keyword[0] == "O"){
      await this.props.find_order_product_detail(token, keyword[1]).then(res => {
        this.setState({
          productDetails : res,
          modalShow : true,
        })
      })
    }
    if(keyword[0] == "E"){
      //eslint-disable-next-line no-undef
      this.props.fetchProductDetail_Exchange(str, item.listofProductDetail).then(res => {
        this.setState({
          productDetails : res,
          modalShow : true
        })
      })
    }
    // if (item.status === 'Complete' || item.status == 'Shipping'){
      
    // }
    
    // console.log('key',this.state.productDetails)
  }

  MyVerticallyCenteredModal = (props) => {
    // let temp = Object.keys(this.state.productDetails)
    console.log(this.state.productDetails);
    let temp = Object.keys(this.state.productDetails);
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
            Order details
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

//   createExchange = (payload) => {
//     token = localStorage.getItem('_auth');
//     this.props.create_exchange(token, payload).then(res => {
//       console.log(res)
//     })
//     this.setState({modalShow: false})
//   }

  render() {
    let { routing } = this.props;
    const { searchText, total, listRouting } = this.state;
    // const Maploader = withScriptjs(Testcomponent)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Routing</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Routing</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12" style={{ textAlign: "center" }}>
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Routing</h3>
                  </div>
                  <form onSubmit={(event) => this.handleSubmit(event)}
                    className="form-inline md-form form-sm mt-0" style={{ justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20 }}>
                    <div className='btn-group'>
                        <button type='submit' className='btn btn-primary'>Generate</button>
                    </div>

                  </form>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Sequences</th>
                            <th>Name recive</th>
                            <th>Phone</th>
                            <th>Details</th>
                            <th>Code order</th>
                            <th>Total Amount</th>
                            <th>Payment Online</th>
                            <th>Address</th>
                            <th>Action</th>
                            {/* <th style={{ textAlign: "center" }}>Time</th> */}
                          </tr>
                          
                        </thead>
                        <tbody>
                          <this.MyVerticallyCenteredModal
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: false})}
                          />
                          {routing && routing.length ? routing.map((item, index) => {
                            {/* console.log(item.isPaymentOnline) */}
                            if(index == 0) return null 
                            else {
                              {/* console.log(item) */}
                              return (
                              <tr key={index}>
                                <th scope="row">{String.fromCharCode(index+65)}</th>
                                <td style={{width:'auto'}}>{item.fullName ? item.fullName : item.reqUserName }</td>
                                <td><span >{item.phone ? item.phone : item.information.phone}</span></td>
                                <td>
                                  <button type="button" className='btn btn-light' onClick={()=>{ 
                                    this.fetch_product_details(item)
                                    // console.log('onclick')
                                    }}>View</button>
                                </td>
                                <td>{item.specialId}</td>
                                <td>{(item.totalAmount && item.isPaymentOnline == false ) ? item.totalAmount : 0}</td>
                                <td style={{ textAlign: "center" }}>{item.isPaymentOnline ?
                                  <div className="i-checks">
                                    <input type="checkbox" onChange={()=>{}} checked={true} className="checkbox-template" />
                                  </div>
                                  :
                                  <div className="i-checks">
                                    <input type="checkbox" onChange={()=>{}} checked={false} className="checkbox-template" />
                                  </div>}
                                </td>
                                <td><p>{item.address ? item.address : item.information.address}</p></td>
                                <td>
                                  <input type="checkbox" 
                                    onChange={(event) => {
                                      // console.log(item.specialId,event.target.checked)
                                      if(!event.target.checked){
                                        this.state.listComplete = this.state.listComplete.filter((item2) => {
                                          return item2.specialId != item.specialId
                                        })
                                        this.setState({
                                          listCancel: [...this.state.listCancel, item]
                                        })
                                      }else{
                                        this.setState({
                                          listComplete : [...this.state.listComplete, item]
                                        })
                                        this.state.listCancel = this.state.listCancel.filter((item2) => {
                                          return item2.specialId != item.specialId
                                        })
                                      }
                                    }}
                                    name="listCancel"
                                    // checked={true}
                                    defaultChecked={false}
                                    className="checkbox-template" />
                                </td>
                              </tr>
                            )
                            }
 
                          }) : null}
                          {console.log(this.state.listMarker)}
                        </tbody>
                      </table>
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
                <div>
                  {/* <Map listRouting = {this.state.listRouting}/> */}
                </div>
                <div className='container'>
                  {this.state.prove && this.state.prove.length ? 
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Route</th>
                          <th>Distance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {console.log('prove',this.state.prove)}
                        {this.state.prove.map((item,index) => {
                          if(index > 5){return null}
                          else{
                            return (
                              <tr>
                                <td>
                                  {item.routing_Order}
                                </td>
                                <td>
                                  {item.totalDistance}
                                </td>
                              </tr>
                            )
                            
                          }
                        })}
                      </tbody>
                    </table>
                  : null} 
                </div>
                {/* <Map listRouting = {this.state.listRouting}/> */}
                {/* <Maploader
                  googleMapURL = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCXxL0MBTRrFF9MBlEMZNwkmenz9zMRtZk"
                  loadingElement = {<div style={{height : '100%'}}/>}
                /> */}
                {/* <button type="button" className='btn btn-secondary' onClick={() => {this.handleStartRouting()}}>Start</button>
                <button type="button" className='btn btn-success' style={{"marginLeft": "10px" }} onClick={() => {
                  this.handleFinishRouting()
                }}>Finish</button> */}
                {/* <button type='button' className='btn btn-warning' onClick={() => {console.log('listComplete',this.state.listComplete) , console.log('listCancel',this.state.listCancel)}} >Click</button> */}
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
  // console.log(state)
  return {
    routing: state.routing
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    generate_routing: (storeName, token) => {
        return dispatch(actGenerateRouting(storeName, token))
    },
    clear_Routing: () => {
      return dispatch(actClearRequest())
    },
    find_order_product_detail:(token, id) => {
      return dispatch(actFindOrderProductDetail(token, id))
    },
    fetchProductDetail_Exchange: (str , token) => {
      return dispatch(actFetchProductDetail(str, token))
    }
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(Routing)