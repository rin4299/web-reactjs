import React, { Component , useRef } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actFetchProductsRequest, actFindProductsRequest } from '../../../redux/actions/product';
import {actTrackingRequest} from '../../../redux/actions/tracking';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import {exportExcel} from 'utils/exportExcel'
import Paginator from 'react-js-paginator';
import callApi from '../../../utils/apiCaller';
import Modal from 'react-bootstrap/Modal'
import {Steps} from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons' ;
import Testcomponent from './Map'
// import RequestCartItems from './RequestCartItems'


import {Container, Card, CardContent, makeStyles, Grid, TextField, Button} from '@material-ui/core';
import QRCode from 'qrcode';
import {QrReader} from 'react-qr-reader';

// import "antd/dist/antd.css"

const MySwal = withReactContent(Swal)

let token;
const {Step} = Steps;
// const qrRef = useRef(null);
// console.log(qrRef)
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
      if (res && res.length){
        res.map((item) => {
          console.log(item.Value.information)
          let lat = item.Value.information.lat
          let lng = item.Value.information.lng
          if(this.state.listMarker !== []){
            this.setState({
              listMarker : []
            })
          }
          this.setState({
            listMarker: [...this.state.listMarker, {lat: lat, lng : lng}]
          })
          // importList : [...this.state.importList, {pId:item.id,pName:item.nameProduct, quantity: 1}]

          // this.state.listMarker.push({lat,lng})
        })
      }
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

  generateQrCode = async () => {
    // console.log(this.state.text)
    
    let results
    let payload = {}
    const { total } = this.state;
    total && total.length ? results = total[total.length-1].Value : results = null
    if(results){
      // console.log('results',results)
      payload = {
        Name : results.productName, 
        ids : results.id,
        ownerName : results.ownerName,
        status : results.status
      }
      payload = JSON.stringify(payload)
      // console.log('payload',payload)

      try {
        const response = await QRCode.toDataURL(payload);
        // setImageUrl(response);
        this.setState({
          imageUrl : response,
          modalShow: true,
        })
      }catch (error) {
        console.log(error);
      }
    }
    // results = JSON.stringify(results)
    // console.log('results',results)

    
  }
  handleErrorFile = (error) => {
    console.log(error);
  }
  handleScanFile = (result) => {
      if (result) {
          // setScanResultFile(result);
          this.setState({
            scanResultFile : result
          })
      }
  }
  onScanFile = () => {
    console.log(this.qrRef.current)
    // qrRef.current.openImageDialog();

  }
  handleErrorWebCam = (error) => {
    console.log(error);
  }
  handleScanWebCam = (result) => {
    if (result){
        // setScanResultWebCam(result);
        this.setState({
          scanResultWebCam : result
        })
    }
  }

  MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        // dialogClassName="modal-200w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            QR CODE
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflow: 'auto'}}>          
          <div className='align-items-center' >
              {this.state.imageUrl ? (
                  <a href={this.state.imageUrl} download>
                      <img style={{'margin-left':'200px'}} src={this.state.imageUrl} alt="img"/>
                  </a>) 
              : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
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
              <div className="col-lg-12" style={{ textAlign: "center" }}>
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
                    <Button  variant="contained" 
                            color="primary" onClick={() => this.generateQrCode()}>Generate</Button>
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
                          <this.MyVerticallyCenteredModal
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: false})}
                          />
                          {total && total.length ? total.map((item, index) => {
                            {/* item.active ? {} : {} */}
                            {/* return (
                              <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td style={{width:'auto'}}>{item.TxId}</td>
                                <td><span >{item.Value.productName}</span></td>
                                <td>{item.Value.id}</td>
                                <td>{item.Value.ownerName}</td>
                                <td><p1>{item.Timestamp}</p1></td>
                              </tr>
                            ) */}
                            console.log('item',item)
                            if(!item.Value.active && index+1 == total.length ){
                              console.log('active',item.Value.active)
                              return (
                                <tr key={index} style={{background: '#FFD2D2'}}>
                                  <th scope="row">{index + 1}</th>
                                  <td style={{width:'auto'}}>{item.TxId}</td>
                                  <td><span >{item.Value.productName}</span></td>
                                  <td>{item.Value.id}</td>
                                  <td>{item.Value.ownerName}</td>
                                  <td><p1>{item.Timestamp}</p1></td>
                                </tr>
                              )
                            }else if(index+1 == total.length){
                              return(
                                <tr key={index} style={{background: '#d5f4e6'}}>
                                  <th scope="row">{index + 1}</th>
                                  <td style={{width:'auto'}}>{item.TxId}</td>
                                  <td><span >{item.Value.productName}</span></td>
                                  <td>{item.Value.id}</td>
                                  <td>{item.Value.ownerName}</td>
                                  <td><p1>{item.Timestamp}</p1></td>
                                </tr>
                              )
                            }else{
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
                <div style={{ textAlign: "center" }}>
                  <Testcomponent id="map" style={{ textAlign: "center" }} path = {this.state.listMarker} total = {total}/>
                </div>
                
                {/* <ArrowUpOutlined style={{fontsize :'400%'}}/> */}
                {/* <Steps 
                  direction='vertical' 
                  current={3}
                  className="site-navigation-steps"
                  type='navigation'
                >
                  <Step title="Finished" description={"somethings"} subTitle="03/02/2022"/>
                  <Step title="Finished" description={"somethings"} subTitle="03/02/2022"/>
                  <Step title="Finished" description={"somethings"} subTitle="03/02/2022"/>
                  <Step title="process" description={"somethings"} subTitle="03/02/2022"/>
                </Steps> */}
                      {/* <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                          <TextField label="Enter Text Here" onChange={(e) => this.setState({text : e.target.value})}/>
                          <Button  variant="contained" 
                            color="primary" onClick={() => this.generateQrCode()}>Generate</Button>
                            <br/>
                            <br/>
                            <br/>
                            {this.state.imageUrl ? (
                              <a href={this.state.imageUrl} download>
                                  <img src={this.state.imageUrl} alt="img"/>
                              </a>) : null}
                      </Grid>
                      <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                        <Button variant="contained" color="secondary" onClick={this.onScanFile()}>Scan Qr Code</Button>
                        <QrReader
                          ref={this.qrRef}
                          delay={300}
                          style={{width: '100%'}}
                          onError={this.handleErrorFile()}
                          onScan={this.handleScanFile()}
                          legacyMode
                        />
                        <h3>Scanned Code: {this.state.scanResultFile}</h3>
                      </Grid> */}
                      {/* <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                         <h3>Qr Code Scan by Web Cam</h3>
                         <QrReader
                         delay={300}
                         style={{width: '100%'}}
                         onError={this.handleErrorWebCam()}
                         onScan={this.handleScanWebCam()}
                         />
                         <h3>Scanned By WebCam Code: {this.state.scanResultWebCam}</h3>
                      </Grid> */}
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





export default connect(null, mapDispatchToProps)(Tracking)