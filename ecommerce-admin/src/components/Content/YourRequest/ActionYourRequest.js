import React, { Component } from 'react'
import MyFooter from '../../MyFooter/MyFooter'
import { actAddProducerRequest, actGetProducerRequest, actEditProducerRequest } from '../../../redux/actions/producer';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import callApi from '../../../utils/apiCaller';
import { css } from '@emotion/core';
import { Link } from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import BarcodeScannerComponent from "react-qr-barcode-scanner"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let token;
let id;
const override = css`
    display: block;
    margin: 0 auto;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
`;
class ActionYourRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      desc: '',
      redirectToYourRequest: false,
      listproduct:[],
      modalShow: false,
      user:[],
      lopSuccess:"",
      ReqTo:"",
      listSuccess:[],
      listMissing:[],
    };
    id = this.props.id
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
    if(id){
        const res = await callApi(`exchange/getinformationexchange/${id}`, 'GET', null, token);
        console.log(res.data)
        let temp = Object.keys(res.data)
        // console.log('temp',temp)
        temp ? temp.map((item) => {
            let object = res.data[item]
            // console.log('object',object)
            this.setState({
              lopSuccess : this.state.lopSuccess ? this.state.lopSuccess + "," + object.product.id + "-" + object.quantity : object.product.id + "-" + object.quantity
            })
            let listid = object.ids.split(",")
            // console.log(listid)
            listid ? listid.map((item) => {
                this.setState({
                    listproduct : [... this.state.listproduct,{ids: item , product: object.product, isChecked : false}]
                })
            }):null
        }) : null
      console.log("lopSuccess",this.state.lopSuccess)
    }
    let ReqTo = localStorage.getItem('_RequestTo')
    this.setState({
      ReqTo : ReqTo
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
    this.setState({
        redirectToYourRequest: true
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
      toast.success('Your Request is done');
    })
    this.setState({
      modalShow: false,
      redirectToYourRequest:true,
    })
    // window.location.reload()
  }

  MyVerticallyCenteredModal = (props) => {
    let payload;
    //eslint-disable
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
          <div>
            {/* eslint-disable */}
            <BarcodeScannerComponent
              width={300}
              height={300}
              // torch={}
              onUpdate={(err,result) => {
                console.log('result',result)
                if(result){
                  payload = JSON.parse(result.text)
                  this.setState({
                    scanResultWebCam : result.text,
                  })
                    this.setState({
                        listproduct : this.state.listproduct.map((item)=>{
                            if(item.ids === payload.ids){
                                toast.success('Product: {'+ item.ids +'} is checked.');
                                return {
                                    ...item,
                                    isChecked: true
                                }
                            }else return item;
                        })
                    })
                    let isDone = this.state.listproduct.every((item) => {
                        item.isChecked === true
                    })
                    if(isDone){
                      this.updateConfirm(id, this.state.lopSuccess, this.state.user[0].name)
                    }
                }else{
                  this.setState({
                    scanResultWebCam : "Not found"
                  })
                  toast.warn('Product: {'+ item.ids +'} is not in this order.');
                }
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {/* <button type='button'>
            <Route className='btn btn-danger' path='productreport/add' render={(match) => <ActionReportProduct data ={{name : this.state.productName}}/>}>Report</Route>
          </button> */}
          <button className='btn btn-primary' onClick={()=>{
            this.setState({
              listSuccess : listproduct.filter((item)=>{
                return item.isChecked === true
              }),
              listMissing : listproduct.filter((item) =>{
                return item.isChecked === false
              }) 
            })
          }}>Finish</button>
          <button type="submit" className="btn btn-info" onClick={(event) => {
                                                                  // this.handleSubmit(event)
                                                                  // this.setState({
                                                                  //   modalShow: false,  
                                                                  // })
                                                                  //eslint-disable-next-line no-unused-expressions  
                                                                  props.onHide
                                                                  }}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }


  render() {
    const { name, desc,redirectToYourRequest, listproduct, user, ReqTo} = this.state;
    if (redirectToYourRequest) {
      return <Redirect to='/yourrequests'></Redirect>
    }
    console.log("listproduct",listproduct)
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Confirm Exchange</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
            <li className="breadcrumb-item active">Exchange</li>
          </ul>
        </div>
        {/* Forms Section*/}
        <section className="forms">
          <div className="container-fluid">
            <div className="row">
              {/* Form Elements */}
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Confirm Exchange</h3>
                  </div>
                  <div className="card-body">
                    <form className="form-horizontal" onSubmit={(event) => this.handleSubmit(event)} >
                        <div className="form-group row">
                            <label className="col-sm-3 form-control-label">From</label>
                            <div className="col-sm-9">
                            <input name="from" disabled value={ user && user.length ? user[0].name : "empty"} type="text" placeholder="Note" className="form-control" />
                            </div>
                        </div>
                        <div className="line" />
                        <div className="form-group row">
                            <label className="col-sm-3 form-control-label">To</label>
                            <div className="col-sm-9">
                            <input name="to" disabled value={ ReqTo } type="text" placeholder="Note" className="form-control" />
                            </div>
                        </div>
                        {id ? <div>
                            <div className="form-group row">
                                <label className="col-sm-3 form-control-label" style={{paddingTop: 50}}>Items</label>
                                <div className="col-sm-9">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-hover" style={{ textAlign: "center" }}>
                                                <thead>
                                                <tr>
                                                    <th>Number</th>
                                                    <th>Product</th>
                                                    <th>Image</th>
                                                    <th>Ids</th>
                                                    <th>isChecked</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <this.MyVerticallyCenteredModal
                                                    show={this.state.modalShow}
                                                    onHide={() => this.setState({modalShow: false})}
                                                />
                                                {listproduct && listproduct.length ? listproduct.sort((a,b) => {
                                                    return b.isChecked - a.isChecked
                                                })
                                                .map((item, index) => {
                                                    if(item.isChecked){
                                                        return (
                                                            <tr key={index} style={{opacity:1}}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{item.product.nameProduct}</td>
                                                            <td>
                                                            <div className="fix-cart">
                                                                <img src={item && item.product ? item.product.image : null} className="fix-img" alt="not found" />
                                                            </div>
                                                            </td>
                                                            <td>{item.ids}</td>
                                                            {/* <td>{item.isChecked}</td> */}
                                                            <td>
                                                                <div className="i-checks">
                                                                    <input type="checkbox" value={item.isChecked} className="checkbox-template" />
                                                                </div>
                                                            </td>
                                                            </tr>
                                                        )
                                                    }else{
                                                        return (
                                                            <tr key={index} style={{opacity:0.4}}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{item.product.nameProduct}</td>
                                                            <td>
                                                            <div className="fix-cart">
                                                                <img src={item && item.product ? item.product.image : null} className="fix-img" alt="not found" />
                                                            </div>
                                                            </td>
                                                            <td>{item.ids}</td>
                                                            <td>
                                                                <div className="i-checks">
                                                                    <input type="checkbox" defaulchecked={false} className="checkbox-template" />
                                                                </div>
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
                            </div>
                        </div>: null}
                        <div className="line" />
                        <div className="form-group row">
                            <div className="col-sm-4 offset-sm-3">
                                <button className="btn btn-secondary" style={{ marginRight: 2 }}><Link to="/yourrequests">Cancel</Link> </button>  
                                <button style={{ marginRight: 6 }} className="btn btn-info" onClick={() => this.setState({modalShow: true})}>Scan</button>
                                <button type="submit" className="btn btn-primary">Confirm</button>
                            </div>
                        </div>
                    </form>
                  </div>
                </div>
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


const mapDispatchToProps = (dispatch) => {
  return {
    add_Producer: (token, newProducer) => {
      dispatch(actAddProducerRequest(token, newProducer))
    },
    get_Producer: (token, id) => {
      dispatch(actGetProducerRequest(token, id))
    },
    edit_Producer: (token, id, data) => {
      dispatch(actEditProducerRequest(token, id, data))
    },
    update_Confirm : (payload, token) => {
      return dispatch(actUpdateConfirm(payload, token))
    },
  }
}
export default connect(null, mapDispatchToProps)(ActionYourRequest)