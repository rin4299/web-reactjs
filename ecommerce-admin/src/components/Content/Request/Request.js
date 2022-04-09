import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProductsRequest, actDeleteProductRequest, actFindProductsRequest } from '../../../redux/actions/product';
import { actFetchExchangeRequest,actUpdateAccept} from '../../../redux/actions/exchange';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import Paginator from 'react-js-paginator';
import callApi from '../../../utils/apiCaller';

import Modal from 'react-bootstrap/Modal'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MySwal = withReactContent(Swal)

let token;


class Request extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      currentPage: 1,
      searchText: '',
      modalShow: false,
      user: [],
      request:{}, 
      id:0,
      nameProduct:'',
      quantityRequest:0,
      total2: 0,
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

    await this.fetch_reload_data(); 
  }

  fetch_reload_data(){
    token = localStorage.getItem('_auth');
    // console.log("id", this.state.user[0].id);
    this.props.fetch_exchange_request(this.state.user[0].id, token).then(res => {
      this.setState({
        total: res,
        total2 : res.slice(0,10)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  pageChange(content){
    const limit = 10;
    const offset = limit * (content - 1);
    this.setState({
      total2: this.state.total.slice(offset, offset + 10),
      currentPage: content
    })
    window.scrollTo(0, 0);
  }
/////////////////////////

  updateAccept = (id, lop, storeName) => {
    const payload = {
      'id': id,
      'lop': lop,
      'storeName': storeName
    }
    token = localStorage.getItem('_auth');
    this.props.update_Accept(payload,token).then(res => {
      console.log(res)
    })
    toast.success('The request is updated');
    this.setState({modalShow: false})
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
            Confirm Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* {console.log('request',this.state.request)} */}
          {/* <h4>Name Product </h4>
          <input  style={{width:"100%"}} disabled defaultValue={props.requests.name}/>   */}
          <form >
            <div className="form-group">
              <label htmlFor="from">From </label>
               <input className="form-control" disabled defaultValue={props.requests.from}/>  
            </div>
            <div className="form-group">
              <label htmlFor="to">To </label>
               <input className="form-control" disabled defaultValue={props.requests.to}/>  
            </div>
            <div className="table-responsive">
                <table className="table table-hover" style={{ textAlign: "center" }}>
                  <thead>
                    <tr>
                      {/* <th style={{width:'30%'}}>Number</th> */}
                      <th>Id-product</th>
                      <th>Name Product</th>
                      <th>Image</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.request.products && this.state.request.products.length ? this.state.request.products.map((item, index) => {
                        return (
                          <tr key = {index}>
                            {/* <td scope="row">{index + 1}</td> */}
                            <td><span className="text-truncate" >{item.id}</span></td>
                            <td><span className="text-truncate" style={{width:'100%'}} >{item.nameProduct}</span></td>
                            <td>
                              <div className="fix-cart">
                                <img src={item && item.image ? item.image : null} className="fix-img" alt="not found" />
                              </div>
                            </td>
                            <td>{item.quantity}</td>
                          </tr>
                        )

                    }) : null}
                  </tbody>
                </table>
            </div>
            <div className="form-group">
              <button className="form-control btn btn-primary" type="button" onClick= {() => {
                this.updateAccept(props.requests.indexExchange, props.requests.listofProduct, props.requests.to)
                this.fetch_reload_data()
                // window.location.reload()
              }}>
                Confirm
              </button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" class="btn btn-info" onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    const {total2, total} = this.state;
    // console.log('total request', total)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Requests</h2>
            <div class="btn-group">
              <button class="button"><Link to="/requests"> <i style ={{}}/>Requests</Link></button>
              <button class="button"><Link to="/yourrequests"> <i style ={{}}/>Your Requests</Link></button>
              <button class="button"><Link to="/historyrequest"> <i style ={{}}/>History</Link></button>
            </div>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Requests</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">List Request</h3>
                  </div>
                  
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover" style={{ textAlign: "center" }}>
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>Id-Request</th>
                            <th>From</th>
                            <th>To</th>
                            <th >Number Product</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {total2 && total2.length ? total2.map((item, index) => {
                            if(item.isAccepted){
                              return null;
                            }
                            else{
                              return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.id}</td>
                                <td><span className="text-truncate" >{item.reqUserName}</span></td>
                                <td><span className="text-truncate" >{item.recUserName}</span></td>
                                <td><span>{item.products.length}</span></td>
                                <td>{item.isAccepted ?
                                  <div className="i-checks">
                                    <input type="checkbox" checked={true} className="checkbox-template" />
                                  </div>
                                  :
                                  <div className="i-checks">
                                    <button class="btn btn-info" onClick={() => this.setState({modalShow: true,request : item, id : item.id, nameProduct: item.products[0].nameProduct, quantityRequest: item.products[0].quantity})}>Accept</button>
                                    <this.MyVerticallyCenteredModal
                                      show={this.state.modalShow}
                                      onHide={() => this.setState({modalShow: false})}
                                      requests ={{name: this.state.nameProduct,from :this.state.request.reqUserName, to:this.state.request.recUserName, Quantity:this.state.quantityRequest, indexExchange : this.state.id, listofProduct:this.state.request.listofProduct}}
                                    />
                                  </div>}
                                </td>
                              </tr>
                              )
                            }                           
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
    fetch_exchange_request: (id, token) => {
      return dispatch(actFetchExchangeRequest(id, token))
    },
    update_Accept: (payload, token) => {
      return dispatch(actUpdateAccept(payload, token))
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(Request)