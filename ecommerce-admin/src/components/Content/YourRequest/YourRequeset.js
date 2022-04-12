import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProductsRequest, actDeleteProductRequest } from '../../../redux/actions/product';
import { actFetchExchangeReceive, actUpdateConfirm, actDeleteRequest} from '../../../redux/actions/exchange';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import Paginator from 'react-js-paginator';
import callApi from '../../../utils/apiCaller';

import Modal from 'react-bootstrap/Modal'


const MySwal = withReactContent(Swal)

let token;


class YourRequest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      currentPage: 1,
      searchText: '',
      modalShow: false,
      user: [],
      receive:'', 
      id:0,
      nameProduct:'',
      quantityRequest:0,
      total2:0,
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

    await this.fetch_reload_data(); 
  }

  fetch_reload_data(){
    token = localStorage.getItem('_auth');
    this.props.fetch_exchange_receive(this.state.user[0].id, token).then(res => {
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
    this.props.fetch_products(token, offset);
    this.setState({
      currentPage: content,
      total2: this.state.total.slice(offset, offset + 10),
    })
    window.scrollTo(0, 0);
  }
/////////////////////////

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
        await this.props.delete_request(id, token);
        Swal.fire(
          'Deleted!',
          'Your request has been deleted.',
          'success'
        )
      }
      // window.location.reload()
    })
  }
  updateConfirm = (id, lop, storeName ) => {
    const payload = {
      'id': id,
      'lop': lop,
      'storeName': storeName
    }
    token = localStorage.getItem('_auth');
    this.props.update_Confirm(payload,token).then(res => {
      console.log(res)
    })
    this.setState({modalShow: false})
    // window.location.reload()
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
            Confirm Your Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <h4>Name Product </h4>
          <input  style={{width:"100%"}} disabled defaultValue={props.receive.name}/>   */}
          <form >
            <div className="form-group">
              <label htmlFor="from">From </label>
               <input className="form-control" disabled defaultValue={props.receive.from}/>  
            </div>
            <div className="form-group">
              <label htmlFor="to">To </label>
               <input className="form-control" disabled defaultValue={props.receive.to}/>  
            </div>
            {/* <div className="form-group">
              <label htmlFor="name">Quantity </label>
              <input className="form-control" disabled defaultValue={props.receive.Quantity}/>
            </div> */}
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
                    {this.state.receive.products && this.state.receive.products.length ? this.state.receive.products.map((item, index) => {
                        {/* console.log('item',item) */}
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
            {this.state.receive.isAccepted ?
              <button className="form-control btn btn-primary" type="button" onClick= {() => {
                this.updateConfirm(props.receive.indexExchange, props.receive.listofProduct, props.receive.from)
                this.fetch_reload_data()
              }}>
                Confirm
              </button>
              :
              null
             }
            
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
    // let { requests } = this.props;
    const {total, total2} = this.state;

    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Your Requests</h2>
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
            <li className="breadcrumb-item active">Your Requests</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">List Your Request</h3>
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
                            <th>Number Product</th>
                            <th>Active</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {total2 && total2.length ? total2.map((item, index) => {
                            {/* console.log('item',item) */}
                            if(item.isReceived){
                              return null;
                            }
                            else{
                              return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.id}</td>
                                <td><span className="text-truncate" >{item.reqUserName}</span></td>
                                <td><span className="text-truncate" >{item.recUserName}</span></td>
                                <td><span className="text-truncate" >{item.products.length}</span></td>
                                <td>{item.isAccepted ?
                                  <div className="i-checks">
                                    <input type="checkbox" checked={true} className="checkbox-template" />
                                  </div>
                                  :
                                  <div className="i-checks">
                                    <input type="checkbox" checked={false} className="checkbox-template" />
                                  </div>}
                                </td>
                                <td>{item.isAccepted ?
                                <div className="i-checks">
                                    <button class="btn btn-info" onClick={() => {this.setState({modalShow: true,receive : item, id : item.id, nameProduct: item.products[0].nameProduct, quantityRequest: item.products[0].quantity} )}}>Confirm</button>
                                    <this.MyVerticallyCenteredModal
                                      show={this.state.modalShow}
                                      onHide={() => this.setState({modalShow: false})}
                                      receive ={{name: this.state.nameProduct,from :this.state.receive.reqUserName, to:this.state.receive.recUserName, Quantity:this.state.quantityRequest, indexExchange : this.state.id, listofProduct:this.state.receive.listofProduct }}
                                    />
                                  </div>
                                  :
                                  <div className="i-checks">
                                    <button class="btn btn-secondary" onClick={() => {this.setState({modalShow: true,receive : item, id : item.id, nameProduct: item.products[0].nameProduct, quantityRequest: item.products[0].quantity} )}}>Waiting</button>
                                    <this.MyVerticallyCenteredModal
                                      show={this.state.modalShow}
                                      onHide={() => this.setState({modalShow: false})}
                                      receive ={{name: this.state.nameProduct,from :this.state.receive.reqUserName, to:this.state.receive.recUserName, Quantity:this.state.quantityRequest, indexExchange : this.state.id , listofProduct:this.state.receive.listofProduct}}
                                    />
                                  </div>
                                  }
                                  
                                  
                                </td>
                                
                                <td>{item.isAccepted ?
                                  null :
                                  <div>
                                    <span title='Delete' onClick={() => this.handleRemove(item.id)} className="fix-action"><Link to="#"> <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></Link></span>
                                  </div>
                                  }
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
    fetch_exchange_receive : (id, token) => {
      return dispatch(actFetchExchangeReceive(id, token))
    },
    update_Confirm : (payload, token) => {
      return dispatch(actUpdateConfirm(payload, token))
    },
    delete_request : (id, token) => {
      return dispatch(actDeleteRequest(id,token))
    }
  }
}




export default connect(mapStateToProps, mapDispatchToProps)(YourRequest)