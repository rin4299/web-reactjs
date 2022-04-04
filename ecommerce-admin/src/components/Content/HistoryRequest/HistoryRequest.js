import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProductsRequest, actDeleteProductRequest, actFindProductsRequest } from '../../../redux/actions/product';
import { actHistoryRequest,actUpdateAccept} from '../../../redux/actions/exchange';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import Paginator from 'react-js-paginator';
import callApi from '../../../utils/apiCaller';

import Modal from 'react-bootstrap/Modal'

const MySwal = withReactContent(Swal)

let token;


class HistoryRequest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      currentPage: 1,
      searchText: '',
      modalShow: false,
      user: [],
      id:0,
      history:'',
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
        // console.log("user",this.state.user)
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
    this.props.fetch_history_request(this.state.user[0].id, token).then(res => {
      this.setState({
        total: res
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
      currentPage: content
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
        await this.props.delete_product(id, token);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  updateAccept = (id) => {
    token = localStorage.getItem('_auth');
    this.props.update_Accept(id,token).then(res => {
      console.log(res)
    })
    this.setState({modalShow: false})
    window.location.reload()
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
            History Detail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflow: 'auto'}}>
          <div >
            {this.state.history.id ? 
            <form >
              <div className="form-group">
                <label htmlFor="from">Id-request </label>
                <input className="form-control" disabled defaultValue={this.state.history.id}/>  
              </div>
              <div className="form-group">
                <label htmlFor="from">From </label>
                <input className="form-control" disabled defaultValue={this.state.history.reqUserName}/>  
              </div>
              <div className="form-group">
                <label htmlFor="to">To </label>
                <input className="form-control" disabled defaultValue={this.state.history.recUserName}/>  
              </div>
              <div className="form-group">
                <label htmlFor="name">Type </label>
                <input className="form-control" disabled defaultValue={this.state.history.reqUserName == this.state.user[0].name ? 'REQUEST' : 'RECEIVE' }/>
              </div>
              <div className="form-group">
                <label htmlFor="from">Time </label>
                <input className="form-control" disabled defaultValue={props.history.times}/>  
              </div>
              <div className="table-responsive">
                <table className="table table-hover" style={{ textAlign: "center" }}>
                  <thead>
                    <tr>
                      <th style={{width:'30%'}}>Number</th>
                      <th>Id-product</th>
                      <th>Name Product</th>
                      <th>Image</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.history.products && this.state.history.products.length ? this.state.history.products.map((item, index) => {
                        return (
                          <tr key = {index}>
                            <td scope="row">{index + 1}</td>
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
            </form>
            : null
            }
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <button type="button" class="btn btn-info" onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    // let { requests } = this.props;
    const {total} = this.state;
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">History Requests</h2>
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
            <li className="breadcrumb-item active">History Requests</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">History Requests</h3>
                  </div>
                  
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover" style={{ textAlign: "center" }}>
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>Id-request</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Type</th>
                            <th>Time</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {total && total.length ? total.map((item, index) => {
                            {/* console.log('item.latestUpdate', item.latestUpdate) */}
                            {/* console.log('item', item) */}
                            {/* var date = new Date(item.latestUpdate.slice(8,18) * 1000); */}
                            {/* console.log(item.latestUpdate) */}
                              return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td><span className="text-truncate" >{item.id}</span></td>
                                <td><span className="text-truncate" >{item.reqUserName}</span></td>
                                <td><span className="text-truncate" >{item.recUserName}</span></td>
                                <td style={{ textAlign: "center" }}> {item.reqUserName == this.state.user[0].name ?
                                <span>REQUEST</span> 
                                :
                                <span>RECEIVE</span> 
                                }
                                </td>
                                <td><p style={{width:'210px'}}>{item.latestUpdate}</p></td>
                                <td>
                                  <div>
                                    <button class="btn btn-info" onClick={() => this.setState({modalShow: true, history : item })}>View More</button>
                                    <this.MyVerticallyCenteredModal
                                        show={this.state.modalShow}
                                        onHide={() => this.setState({modalShow: false})}
                                        history ={{times : item.latestUpdate}}
                                      />
                                  </div>
                                </td>
                              </tr>
                              )
                            {/* }                            */}
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
    fetch_history_request: (id, token) => {
      return dispatch(actHistoryRequest(id, token))
    },
    update_Accept: (id, token) => {
      return dispatch(actUpdateAccept(id, token))
    }
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(HistoryRequest)