import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProductsRequest, actDeleteProductRequest, actFindProductsRequest } from '../../../redux/actions/product';
import { actFetchExchangeRequest} from '../../../redux/actions/exchange';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import Paginator from 'react-js-paginator';
import callApi from '../../../utils/apiCaller';

import Modal from 'react-bootstrap/Modal'

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
      user: []
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
    this.props.fetch_exchange_request(this.state.user[0].id, token).then(res => {
      console.log('3', res)
      this.setState({
        total: res
      })
    }).catch(err => {
      console.log(err)
    })
    // this.props.fetch_products(token).then(res => {
    //   this.setState({
    //     total: res.total
    //   });
    // }).catch(err => {
    //   console.log(err);  
    // })
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
  // handleChange = (event) => {
  //   const target = event.target;
  //   const value = target.type === 'checkbox' ? target.checked : target.value;
  //   const name = target.name;
  //   this.setState({
  //     [name]: value
  //   });
  // }

  render() {
    let { requests } = this.props;
    const {total} = this.state;
    // console.log('2', total)
    // console.log('1', requests)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Requests</h2>
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
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>Name</th>
                            <th>From</th>
                            <th>To</th>
                            <th >Quantity</th>
                            {/* <th>Properties</th> */}
                            {/* <th style={{ textAlign: "center" }}>Images</th> */}
                            <th style={{ textAlign: "center" }}>Action</th>
                            {/* <th style={{ textAlign: "center" }}>Remove</th> */}
                            {/* <th style={{ textAlign: "center" }}>Request</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {total && total.length ? total.map((item, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.reqUserName}</td>
                                <td><span className="text-truncate" style={{ width: 300 }}>{item.recUserName}</span></td>
                                <td>{item.quantity}</td>
                                <td><span style={{ display: "flex", justifyContent:"center" }}>{item.pName}</span></td>
                                {/* <td>{item.properties}</td> */}
                                {/* <td style={{ textAlign: "center" }}>
                                  <div className="fix-cart">
                                    <img src={item && item.image ? item.image : null} className="fix-img" alt="not found" />
                                  </div>
                                </td> */}
                                <td style={{ textAlign: "center" }}>
                                  <div className="i-checks">
                                      {/* <input type="checkbox" className="checkbox-template" /> */}
                                    <button class="btn btn-info" onClick={() => this.setState({modalShow: true,modalName : item.nameProduct})}>Accept</button>
                                    <MyVerticallyCenteredModal
                                      show={this.state.modalShow}
                                      onHide={() => this.setState({modalShow: false})}
                                      products ={{name: item.pName,description :item.pName,from :"Store A", to:"Store B", Quantity:item.pName }}
                                    />
                                  </div>
                                </td>
                                {/* <td style={{ textAlign: "center" }}>
                                  <div>
                                    <span title='Edit' className="fix-action"><Link to={`/products/edit/${item.id}`}> <i className="fa fa-edit"></i></Link></span>
                                    <span title='Delete' onClick={() => this.handleRemove(item.id)} className="fix-action"><Link to="#"> <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></Link></span>
                                  </div>
                                </td> */}
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
    fetch_exchange_request : (id, token) => {
      return dispatch(actFetchExchangeRequest(id, token))
    }
  }
}


const MyVerticallyCenteredModal = (props) => {
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
        <h4>Name Product </h4>
        <input  style={{width:"100%"}} disabled defaultValue={props.products.name}/>  
        <form >
          <div className="form-group">
            <label htmlFor="from">From </label>
            {/* <input className="form-control" id="from" />
             */}
             <input className="form-control" disabled defaultValue={props.products.from}/>  
          </div>
          <div className="form-group">
            <label htmlFor="to">To </label>
             <input className="form-control" disabled defaultValue={props.products.to}/>  
          </div>
          <div className="form-group">
            <label htmlFor="name">Quantity </label>
            <input className="form-control" disabled defaultValue={props.products.Quantity}/>
          </div>
          <div className="form-group">
            <button className="form-control btn btn-primary" type="submit">
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

export default connect(mapStateToProps, mapDispatchToProps)(Request)