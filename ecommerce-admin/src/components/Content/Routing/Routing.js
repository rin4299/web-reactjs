import React, { Component , useRef } from 'react'
// import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {actGenerateRouting} from '../../../redux/actions/routing';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import callApi from '../../../utils/apiCaller';
import Testcomponent from './Map'
import Paginator from 'react-js-paginator';
import { toast } from "react-toastify";
import { withScriptjs } from 'react-google-maps'

// import "antd/dist/antd.css"

const MySwal = withReactContent(Swal)

let token;
// const qrRef = useRef(null);
// console.log(qrRef)
class Routing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: [],
      currentPage: 1,
      searchText: '',
      modalShow: false,
      quantity: '',
      user: [],
      text: '',
      // qrRef:null
      listRouting: [],

    }
    this.qrRef = React.createRef()
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
    this.setState({
      [name]: value
    });
  }

handleSubmit = async (event) => {
    event.preventDefault();
    token = localStorage.getItem('_auth');
    const { user } = this.state;
    console.log('user', user[0].name)
    let storeName = user[0].name;
    // const res = await this.props.generate_routing(storeName,token)
    // console.log('res',res)

    await this.props.generate_routing(storeName, token).then(res => {
      console.log(res)
      this.setState({
        listRouting : res
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
          this.state.listRouting && this.state.listRouting.length ? this.state.listRouting.map((item) => {
            let payload = {
              orderId : item.id,
              status:"Complete",
              atStore : this.state.user[0].name,
              fullName : item.fullName
            }
            const res = callApi('order/changestatus',"POST", payload, token);
            if (res && res.status === 200) {
              toast.success('Order: {'+ item.id +'} has been complete.');
            }
            
          }
          ):null
      }
    })
  }

  handleStartRouting = async () => {
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
          this.state.listRouting && this.state.listRouting.length ? this.state.listRouting.map((item) => {
            let payload = {
              orderId : item.id,
              status:"Shipping",
              atStore : this.state.user[0].name,
              fullName : item.fullName
            }
            const res = callApi('order/changestatus',"POST", payload, token);
            if (res && res.status === 200) {
              toast.success('Order: {'+ item.id +'} is shipping.');
            }
            
          }
          ):null
      }
    })
  }


//   createExchange = (payload) => {
//     token = localStorage.getItem('_auth');
//     this.props.create_exchange(token, payload).then(res => {
//       console.log(res)
//     })
//     this.setState({modalShow: false})
//   }

  render() {
    let { products } = this.props;
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
                    
                    {/* <button onClick={()=>this.downloadExcel()} style={{ border: 0, background: "white" }}> <i className="fa fa-file-excel-o"
                        style={{fontSize: 18, color: '#1d7044'}}> Excel</i></button> */}
                  </div>
                  <form onSubmit={(event) => this.handleSubmit(event)}
                    className="form-inline md-form form-sm mt-0" style={{ justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20 }}>
                    <div className='btn-group'>
                      {/* <button style={{border: 0, background: 'white'}}> <i className="fa fa-search" aria-hidden="true"></i></button>                  
                      <input
                        name="searchText"
                        onChange={this.handleChange}
                        value={searchText}
                        className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                        aria-label="Search" /> */}
                        <button type='submit' className='btn btn-primary'>Generate</button>
                    </div>

                  </form>
                  <div className="card-body">
                    <div className="table-responsive">
                      {/* <table className="table table-hover">
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
                      </table> */}
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>Name recive</th>
                            <th>Phone</th>
                            <th>Code order</th>
                            <th>Total Amount</th>
                            <th>Payment Online</th>
                            <th>Address</th>
                            {/* <th style={{ textAlign: "center" }}>Time</th> */}
                          </tr>
                          
                        </thead>
                        <tbody>
                          {listRouting && listRouting.length ? listRouting.map((item, index) => {
                            return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td style={{width:'auto'}}>{item.fullName}</td>
                                <td><span >{item.phone}</span></td>
                                <td>{item.id}</td>
                                <td>{item.totalAmount}</td>
                                <td style={{ textAlign: "center" }}>{item.isPaymentOnline ?
                                  <div className="i-checks">
                                    <input type="checkbox" onChange={()=>{}} checked={true} className="checkbox-template" />
                                  </div>
                                  :
                                  <div className="i-checks">
                                    <input type="checkbox" onChange={()=>{}} checked={false} className="checkbox-template" />
                                  </div>}
                                </td>
                                <td><p>{item.address}</p></td>
                              </tr>
                            )
                          }) : null}
                          {/* {console.log(this.state.listMarker)} */}
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
                {/* <Testcomponent listRouting = {this.state.listRouting}/> */}
                {/* <Maploader
                  googleMapURL = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCXxL0MBTRrFF9MBlEMZNwkmenz9zMRtZk"
                  loadingElement = {<div style={{height : '100%'}}/>}
                /> */}
                <button type="button" className='btn btn-secondary' onClick={() => {this.handleStartRouting()}}>Start</button>
                <button type="button" className='btn btn-success' style={{"margin-left": "10px" }} onClick={() => {
                  this.handleFinishRouting()
                  // console.log(listRouting)
                  // listRouting && listRouting.length ? listRouting.map((item) => {
                  //   let payload = {
                  //     orderId : item.id,
                  //     status:"Complete",
                  //     atStore : this.state.user[0].name,
                  //     fullName : item.fullName
                  //   }
                  //   console.log(payload)
                    // this.handleChangeStatus(payload)
                  // }) : null

                }}>Finish</button>
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

// const mapStateToProps = (state) => {
//   return {
//     products: state.products
//   }
// }

const mapDispatchToProps = (dispatch) => {
  return {
    generate_routing: (storeName, token) => {
        return dispatch(actGenerateRouting(storeName, token))
    }
  }
}





export default connect(null, mapDispatchToProps)(Routing)