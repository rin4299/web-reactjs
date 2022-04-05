import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProductsRequest, actDeleteProductRequest, actFindProductsRequest } from '../../../redux/actions/product';
import {actTrackingRequest} from '../../../redux/actions/tracking';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import {exportExcel} from 'utils/exportExcel'
import Paginator from 'react-js-paginator';
import callApi from '../../../utils/apiCaller';
import Modal from 'react-bootstrap/Modal'


const MySwal = withReactContent(Swal)

let token;


class Tracking extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: [],
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

    //   const res2 = await callApi(`admindiff/${this.state.user[0].id}`, 'GET', null, token);  
    //     if (res2 && res2.status === 200) {
    //       this.setState({
    //         userdiff: res2.data
    //       })
          // console.log("test" , this.state.userdiff)
        //   this.setState({
        //     recUser: this.state.userdiff[0] ? this.state.userdiff[0].name : null
        //   })
          
          
          // console.log("recuser" , this.state.recUser)
        // }
    } else {
      this.setState({
        redirect: true
      })    
    }
    
    // await this.fetch_reload_data(); 
  }

  fetch_reload_data(){
    token = localStorage.getItem('_auth');
    this.props.tracking_request(this.state.searchText,token).then(res => {
      this.setState({
        total: res
      });
    }).catch(err => {
      console.log(err);  
    })
  
  }


//   pageChange(content){
//     const limit = 10;
//     const offset = limit * (content - 1);
//     this.props.fetch_products(token, offset);
//     this.setState({
//       currentPage: content
//     })
//     window.scrollTo(0, 0);
//   }

 

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
    // console.log('searchText', searchText)
    this.props.tracking_request(searchText, token).then(res => {
        // console.log('test',res)
      this.setState({
        total: res
      })
    })
    // this.props.find_products(token, searchText).then(res => {
    //     this.setState({
    //       total: res.total
    //     })
    //   })
    
  }


//   createExchange = (payload) => {
//     token = localStorage.getItem('_auth');
//     this.props.create_exchange(token, payload).then(res => {
//       console.log(res)
//     })
//     this.setState({modalShow: false})
//   }



  MyVerticallyCenteredModal = (props) => {
    // let optionTo = this.state.usediff;
    // console.log("test2", this.state.userdiff)
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
    let { products } = this.props;
    const { searchText, total } = this.state;
    
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Tracking</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Tracking</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Tracking Sequences</h3>
                    
                    {/* <button onClick={()=>this.downloadExcel()} style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                        style={{fontSize: 18, color: '#1d7044'}}> Excel</i></button> */}
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
                  </form>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>TxId</th>
                            <th>Product Name</th>
                            <th>Id Product</th>
                            <th>Owner Name</th>
                            <th style={{ textAlign: "center" }}>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {total && total.length ? total.map((item, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td style={{width:'auto'}}>{item.TxId}</td>
                                <td><span >{item.Value.productName}</span></td>
                                <td>{item.Value.id}</td>
                                <td>{item.Value.ownerName}</td>
                                <td><p1>{item.Timestamp}</p1></td>
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
    find_products: (token, searchText) => {
        return dispatch(actFindProductsRequest(token, searchText))
    },
    tracking_request: (id, token) => {
        return dispatch(actTrackingRequest(id, token))
    }
  }
}





export default connect(mapStateToProps, mapDispatchToProps)(Tracking)