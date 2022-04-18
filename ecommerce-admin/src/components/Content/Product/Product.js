import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProductsRequest, actDeleteProductRequest, actFindProductsRequest , actFetchProductsRequest2} from '../../../redux/actions/product';
import { actCreateExchange, actGetManyDiff } from '../../../redux/actions/exchange';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import {exportExcel} from 'utils/exportExcel'
import Paginator from 'react-js-paginator';
import callApi from '../../../utils/apiCaller';
import Modal from 'react-bootstrap/Modal'
import { startLoading, doneLoading } from '../../../utils/loading'
import { actAddCartRequest, actFetchCartRequest } from '../../../redux/actions/cart';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MySwal = withReactContent(Swal)

let token;


class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      total2: 0,
      currentPage: 1,
      searchText: '',
      modalShow: false,
      productName : '',
      selected:'',
      quantity: '',
      user: [],
      recUser: '',
      userdiff: []
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
          this.setState({
            recUser: this.state.userdiff[0] ? this.state.userdiff[0].name : null
          })
        }
    } else {
      this.setState({
        redirect: true
      })    
    }
    
    await this.fetch_reload_data(); 
    this.props.fetch_items();
  }

  fetch_reload_data(){
    token = localStorage.getItem('_auth');
    // console.log('name', this.state.user[0].name)
    this.props.fetch_products(token,null, this.state.user[0].name).then(res => {
      this.setState({
        total: res,
        total2 : res.slice(0,10)
      });
    }).catch(err => {
      console.log(err);  
    })  
  }


  pageChange(content){
    const limit = 10;
    const offset = limit * (content - 1);
    this.props.fetch_products(token,offset, this.state.user[0].name);
    this.setState({
      total2: this.state.total.slice(offset, offset + 10),
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
  filter = (event) => {
    const keyword = event.target.value
    this.setState({
      searchText: keyword
    });
    if(keyword !== ''){
      const result = this.state.total.filter((item)=> {
        return item.nameProduct.toLowerCase().startsWith(keyword.toLowerCase());
      })
      this.setState({
        total: result,
        total2: result.slice(0,10)
      })
    }
    else{
      this.fetch_reload_data()
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { searchText } = this.state;
    // console.log('test',searchText)
    searchText === "" ? this.fetch_reload_data() : 
    this.props.find_products(token, searchText).then(res => {
      this.setState({
        total2: res.results,
        total : res.results
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
    toast.success('The request is created');
    this.setState({modalShow: false})
  }

  addItemToCart = (product) => {
    startLoading()
    this.props.addCart(product);
    doneLoading();
  }



  MyVerticallyCenteredModal = (props) => {
    // let optionTo = this.state.usediff;
    // console.log("test2", props)
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
            <div className="form-group">
              <label htmlFor="name">Quantity </label>
              <input style = {{width:"100%"}} id="quantity" name="quantity" type ="number" min="1" onChange={(event) => this.setState({quantity : event.target.value}) } />
            </div>
            <div className="form-group">
              <button type="button" className="form-control btn btn-primary" onClick={() => 
                this.createExchange({
                  reqUserName:this.state.user[0].name,
                  recUserName:this.state.recUser,
                  multiRequest: [{pName:props.products.name, quantity:this.state.quantity}]
                })
              }>
                Submit
              </button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer
        onHide={() => this.setState({modalShow: false})}>
          {/* <Button onClick={props.onHide}>Close</Button> */}
          <button type="button" class="btn btn-info" onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    // let {products} = this.props;
    let products = this.state.total2;
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
                  <div style={{witdh:"30px", justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20, marginLeft:"auto" }}>          
                      <input
                        name="searchText"
                        onChange={this.filter}
                        value={searchText}
                        className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                        aria-label="Search" />
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover" style={{ textAlign: "center" }}>
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Available</th>
                            {/* <th>Properties</th> */}
                            <th>Images</th>
                            <th>Active</th>
                            <th>Action</th>
                            {/* <th style={{ textAlign: "center" }}>Request</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {products && products.length ? products.map((item, index) => {
                            {/* console.log('ownership',item) */}
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.nameProduct}</td>
                                <td><span className="text-truncate" style={{ width: 300 }}>{item.description}</span></td>
                                <td>{item.price}</td>
                                <td>{item.ownership && item.ownership.length ? 
                                  item.ownership.map((item2,index)=>{
                                    if (item2.storeName === this.state.user[0].name){
                                      return (item2.quantity)
                                    }                                  
                                  }) :
                                  'Error1'
                                }</td>
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
                                    products ={{name: this.state.productName}}
                                  />
                                </td>
                                <td>
                                  <button className="add-cart active"><Link to="#" onClick={() => this.addItemToCart(item)} >Add</Link></button>

                                  {/* <button>Add</button> */}
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
  return {
    products: state.products
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_products: (token, offset, storename) => {
       return dispatch(actFetchProductsRequest(token, offset, storename))
    },
    fetch_products2: (token, storename) => {
      return dispatch(actFetchProductsRequest2(token, storename))
   },
    delete_product: (id, token) => {
      dispatch(actDeleteProductRequest(id, token))
    },
    find_products: (token, searchText) => {
      return dispatch(actFindProductsRequest(token, searchText))
    },
    create_exchange: (token, payload) => {
      return dispatch(actCreateExchange(token, payload))
    }, 
    getmany_diff: (id, token) => {
      return dispatch(actGetManyDiff(id, token))
    },
    addCart: (item, quantity) => {
      dispatch(actAddCartRequest(item, quantity))
    },
    fetch_items: () => {
      dispatch(actFetchCartRequest())
    },
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(Product)