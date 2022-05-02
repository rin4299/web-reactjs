import React, { Component , useRef } from 'react'
// import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {actTrackingRequest} from '../../../redux/actions/tracking';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import callApi from '../../../utils/apiCaller';
import { ArrowUpOutlined } from '@ant-design/icons' ;
import Testcomponent from './Map'
import Paginator from 'react-js-paginator';


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
      productName : '',
      selected:'',
      quantity: '',
      user: [],
      recUser: '',
      userdiff: [],
      //
      text: '',
      imageUrl:'',
      scanResultFile:'',
      scanResultWebCam:'',
      // qrRef:null
      listMarker: [],

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
    const { user } = this.state;
    // console.log('user', user[0].name)
    let storeName = user[0].name;
    const res = await callApi('routing/${storeName}', 'GET', null, token);
    if (res && res.status === 200) {
    console.log(res)
    }
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
    const { searchText, total } = this.state;
    
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
                      <button style={{border: 0, background: 'white'}}> <i className="fa fa-search" aria-hidden="true"></i></button>                  
                      <input
                        name="searchText"
                        onChange={this.handleChange}
                        value={searchText}
                        className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                        aria-label="Search" />
                    </div>
                    <button type='button' className='btn btn-primary' onClick={this.handleSubmit}>Generate</button>

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
                            <th>Address</th>
                            {/* <th style={{ textAlign: "center" }}>Time</th> */}
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
                {/* <Testcomponent path = {this.state.listMarker}/> */}
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
    tracking_request: (id, token) => {
        return dispatch(actTrackingRequest(id, token))
    }
  }
}





export default connect(null, mapDispatchToProps)(Routing)