import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProductsRequest, actDeleteProductRequest, actFindProductsRequest } from '../../../redux/actions/product';
import { actCreateExchange } from '../../../redux/actions/exchange';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import {exportExcel} from 'utils/exportExcel'
import Paginator from 'react-js-paginator';

import Modal from 'react-bootstrap/Modal'
// import { actCreateExchangeDispatch } from 'redux/actions/exchange';

const MySwal = withReactContent(Swal)

let token;


class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      currentPage: 1,
      searchText: '',
      modalShow: false,
      productName : '',
      selected:'',
      quantity: ''
    }
  }

  componentDidMount() {
    this.fetch_reload_data();
  }

  fetch_reload_data(){
    token = localStorage.getItem('_auth');
    this.props.fetch_products(token).then(res => {
      this.setState({
        total: res.total
      });
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

  downloadExcel = () => {
    const key = 'products'
    exportExcel(key)
  }

  createExchange = (payload) => {
    token = localStorage.getItem('_auth');
    this.props.create_exchange(token, payload).then(res => {
      console.log(res)
    })
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
            Request Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Name Product </h4>
          <input style={{width:"100%"}} disabled defaultValue={props.products.name}/>  
          <form>
            <div className="form-group">
              <label style={{"margin-top":"20px"}} htmlFor="name">Request To </label>
              <br />
              <select defaultValue= "admin"
              // onChange={this.handleChange} 
              >
                <option value="admin 2">admin 2</option>
                <option value="admin 3">admin 3</option>
                <option value="admin 4">admin 4</option>
              </select>
                {/* <p>{message}</p> */}
            </div>       
            <div className="form-group">
              <label htmlFor="name">Quantity </label>
              <input  className="form-control" id="name" />
            </div>
            <div className="form-group">
              <button type="button" className="form-control btn btn-primary" onClick={() => 
                this.createExchange({
                  reqUserName:"admin",
                  recUserName:"admin2",
                  pName:"Đồng hồ thông minh Samsung Galaxy Watch Active 2",
                  quantity: 2
              })
              }>
                Submit
              </button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={props.onHide}>Close</Button> */}
          <button type="button" class="btn btn-info" onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    let { products } = this.props;
    const { searchText, total } = this.state;
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
            <li className="breadcrumb-item active">Products</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Data Table Products</h3>
                    
                    <button onClick={()=>this.downloadExcel()} style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                        style={{fontSize: 18, color: '#1d7044'}}> Excel</i></button>
                  </div>
                  <form onSubmit={(event) => this.handleSubmit(event)}
                    className="form-inline md-form form-sm mt-0" style={{ justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20 }}>
                    <div>
                      <button style={{border: 0, background: 'white'}}> <i className="fa fa-search" aria-hidden="true"></i></button>                  
                      <input
                        name="searchText"
                        onChange={this.handleChange}
                        value={searchText}
                        className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                        aria-label="Search" />
                    </div>
                    <Link to='/products/add' className="btn btn-primary" > Create</Link>
                  </form>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Available</th>
                            {/* <th>Properties</th> */}
                            <th style={{ textAlign: "center" }}>Images</th>
                            <th style={{ textAlign: "center" }}>Active</th>
                            <th style={{ textAlign: "center" }}>Action</th>
                            {/* <th style={{ textAlign: "center" }}>Request</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {products && products.length ? products.map((item, index) => {

                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.nameProduct}</td>
                                <td><span className="text-truncate" style={{ width: 300 }}>{item.description}</span></td>
                                <td>{item.price}</td>
                                <td>{item.numberAvailable}</td>
                                {/* <td>{item.properties}</td> */}
                                <td style={{ textAlign: "center" }}>
                                  <div className="fix-cart">
                                    <img src={item && item.image ? item.image : null} className="fix-img" alt="not found" />
                                  </div>
                                </td>
                                <td style={{ textAlign: "center" }}>{item.isActive ?
                                  <div className="i-checks">
                                    <input type="checkbox" checked={true} className="checkbox-template" />
                                  </div>
                                  :
                                  <div className="i-checks">
                                    <input type="checkbox" checked={false} className="checkbox-template" />
                                  </div>}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <div>
                                    <span title='Edit' className="fix-action"><Link to={`/products/edit/${item.id}`}> <i className="fa fa-edit"></i></Link></span>
                                    <span title='Delete' onClick={() => this.handleRemove(item.id)} className="fix-action"><Link to="#"> <i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></Link></span>
                                  </div>
                                </td>
                                <td>
                                  <button class="btn btn-info" onClick={() => this.setState({modalShow: true, productName : item.nameProduct})}>Request</button>
                                  <this.MyVerticallyCenteredModal
                                    show={this.state.modalShow}
                                    onHide={() => this.setState({modalShow: false})}
                                    products ={{name: this.state.productName,description :"good", avaiable:"available" }}
                                  />
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
    create_exchange: (token, payload) => {
      console.log('hihi')
      return dispatch(actCreateExchange(token, payload))
    }
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(Product)