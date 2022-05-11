import React, { Component } from 'react'
import MyFooter from '../../MyFooter/MyFooter'
import 'react-quill/dist/quill.snow.css';
import {actFetchProductsRequest } from '../../../redux/actions/product';
// import {actCreateReport} from '../../../redux/actions/productreport';
import { actCreateReportRequest } from '../../../redux/actions/productreport'
import { connect } from 'react-redux'
import callApi from '../../../utils/apiCaller';
import { css } from '@emotion/core';
import { Link } from 'react-router-dom'
import './style.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
// import { DropDownListComponent, AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns';
import TextField from "@mui/material/TextField"
import AutoComplete from "@mui/material/Autocomplete"

// import {AutoComplete } from 'antd';
let token;
let id;
let listProductName = []
const override = css`
    display: block;
    margin: 0 auto;
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
`;
class ActionReportProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // nameProduct: '',
      pId: 0,
      quantity: 0,
      redirectToProduct: false,
      user: [],
      product:[],
      productAdd:{},
      pdId:'',
      type:'',
      note:'',
      reportList: [],
      image:'',
      value :'',
      inputValue:''
    };
    // id = this.props.id
    // const location = useLocation()
  } 
  async componentDidMount() {
    token = localStorage.getItem('_auth');
    // const resCategories = await callApi('categories?limit=100', 'GET', null, token);
    // this.setState({
    //   dataCategories: resCategories.data.results
    // })

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

    this.props.fetch_products(token,null, this.state.user[0].name).then(res => {
        if(res && res.length){
          res.map((item) => {
            // console.log(item)
            listProductName = [...listProductName, item.nameProduct]
          })
        }
        this.setState({
          product: res,
        });

        let item2 = localStorage.getItem('_ReportItem')
        item2 = JSON.parse(item2)
        // console.log('item', item2)
        if(item2 != "empty"){
          let item = res.filter((item) => {
            return item.nameProduct == item2.productName
          })
          // console.log('res',item)
          this.setState({
            inputValue : item2.productName,
          })
          // console.log('image', item[0])
          if(item[0]){
            this.setState({
              pId : item[0].id,
              image : item[0].image,
              pdId : item2.ids
            })
          // }else{
          //   this.setState({
          //     pId : 0,
          //     image : '',
          //     pdId : 0
          //   })
          // localStorage.setItem('_ReportItem', "empty")
          localStorage.setItem('_ReportItem', JSON.stringify([]) );
          }
        }
      }).catch(err => {
        console.log(err);  
      }) 
    
    
    // console.log(localStorage.getItem('_ReportItem'))
    

    // if (id) {
    //   const res = await callApi(`products/${id}`, 'GET', null, token);
    //   if (res && res.status === 200){
    //     const resProducer =  await callApi(`category/${res.data.categoryId}/producers`, 'GET', null);
    //     const convertProperties = JSON.stringify(res.data.properties)
    //     var temp = 0;
    //     for(let i = 0 ; i < res.data.ownership.length; i++){
    //       if(res.data.ownership[i].storeName === this.state.user[0].name){
    //         temp = res.data.ownership[i].quantity;
    //       }
    //     }
    //     this.setState({
    //       dataProducer: resProducer.data,
    //       nameProduct: res.data.nameProduct,
    //       price: res.data.price,
    //       numberAvailable: temp,
    //       categoryId: res.data.categoryId,
    //       desc: res.data.description,
    //       isActive: res.data.isActive,
    //       image: res.data.image,
    //       properties: convertProperties,
    //       producerId: res.data.producerId,
    //       dataGallery: res.data.gallery
    //     })
    //   }
    //   }

  }


  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  
  handleChangeComplete = (event) => {
    const value =  event.target.value;
    let item = event.target.itemData;
    this.setState({
        // productAdd: item,
        pId: item.id,
        image: item.image
    });    
  }

  handleInputChange = (newInputValue) =>{
    let item = this.state.product.filter((item) => {
      return item.nameProduct == newInputValue
    })
    this.setState({
      inputValue : newInputValue,
    })
    // console.log('image', item[0])

    if(newInputValue && item[0]){
      this.setState({
        pId : item[0].id,
        image : item[0].image
      })
    }else{
      this.setState({
        pId : 0,
        image : '',
        pdId : 0
      })
    }
  }

  handleAddToReport = () =>{
    // let item = this.state.productAdd
    // if (item){
        // let newList = [...this.state.reportList, {pId:item.id,pName:item.nameProduct, quantity: 1}]
        // console.log('newList',newList)
        // this.setState({
        //   reportList : [...this.state.reportList, {pId:item.id,pName:item.nameProduct, quantity: 1}]
        // })
    // }
    const {pId, pdId, type, note} = this.state
    if (pId && pdId && type && note){
      let ids='';
      let count = pdId.split(",");
      pdId.split(",").forEach((item) =>{
        if(ids ==='') ids = item
        else {
          ids = ids +'-'+ item
        }
        
      })
          
      // console.log('pid', pId)
      // console.log('pdId', pdId, ids)
      // console.log('type', type)
      // console.log('note', note)
      // console.log('length', count.length)
      let newList = [...this.state.reportList, {pId:pId,pdId : ids, type: type, note: note, quantity: count.length}]
      this.setState({
        reportList : newList
      })
      console.log(newList)
    }
  }

  handleRemove = (pId) => {
    let newList = [...this.state.reportList]
    newList.map((item,index)=>{
        if(item.pId === pId){
            newList.splice(index,1)
        }
    })
    this.setState({
      reportList : newList
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    
  }

  createReport = (payload) => {
    token = localStorage.getItem('_auth');
    // console.log(payload)
    // console.log(token)
    if(token){
        this.props.create_report(payload, token).then(res => {
            console.log(res)
            this.setState({
              reportList:''
            })
        })
    }
    toast.success('New Report is created');
  }

  render() {
    const { pId, pdId, type, note, quantity, reportList, product, image} = this.state;
 
    // console.log('data',this.props)
    // let test = this.state.reportList;
    //  console.log('listProduct',listProductName)
    
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Form Product Report</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
            <li className="breadcrumb-item active">Product Report</li>
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
                    <h3 className="h4">Descriptions</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Product Id</th>
                            <th>ids</th>
                            {/* <th>Address</th> */}
                            <th>Type</th>
                            <th>Note</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportList && reportList.length ? reportList.map((item,index)=>{
                            return(
                                <tr key={index}>
                                    <td>{item.pId}</td>
                                    {/* <td>{item.pdID}</td> */}
                                    <td>
                                      <input name="ids" onChange={(event)=>{
                                          console.log(item.pId)
                                          const value = event.target.value;
                                          // let temp_state = this.state.reportList
                                          this.setState({
                                            reportList : reportList.map((object)=>{
                                              if(object.pId === item.pId){
                                                  return {
                                                      ...object,
                                                      pdId: value
                                                  }
                                              }else return object;})
                                          })
                                      }} value={item.pdId} type="string" className="form-control" />
                                    </td>
                                    {/* <td>{item.quantity}</td> */}
                                    <td>
                                      <input name="type" onChange={(event)=>{
                                          console.log(item.pId)
                                          const value = event.target.value;
                                          // let temp_state = this.state.reportList
                                          this.setState({
                                            reportList : reportList.map((object)=>{
                                              if(object.pId === item.pId){
                                                  return {
                                                      ...object,
                                                      type: value
                                                  }
                                              }else return object;})
                                          })
                                      }} value={item.type} type="string" className="form-control" />
                                    </td>
                                    <td>
                                      <input name="note" onChange={(event)=>{
                                          console.log(item.pId)
                                          const value = event.target.value;
                                          // let temp_state = this.state.reportList
                                          this.setState({
                                            reportList : reportList.map((object)=>{
                                              if(object.pId === item.pId){
                                                  return {
                                                      ...object,
                                                      note: value
                                                  }
                                              }else return object;})
                                          })
                                      }} value={item.note} type="string" className="form-control" />
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                        <span title='Delete' onClick={() => this.handleRemove(item.pId)} className="fix-action"><i className="fa fa-trash" style={{ color: '#ff00008f' }}></i></span>
                                    </td>
                                </tr>
                            )
                          }):null}
                        </tbody>
                      </table>
                    </div>
                    <form className="form-horizontal" style={{marginTop:'100px'}} onSubmit={this.handleSubmit}>
                        <div className="form-group row">
                            <label className="col-sm-3 form-control-label">Name Product</label>
                            <div className="col-sm-6">
                                {/* <AutoCompleteComponent
                                    dataSource={product}
                                    fields={{value:'nameProduct'}}
                                    onChange={this.handleChangeComplete}
                                ></AutoCompleteComponent> */}
                                <AutoComplete
                                  value={this.state.inputValue}
                                  //eslint-disable-next-line no-restricted-globals
                                  onChange={(event, newValue => {
                                    // console.log('Newvalue',newValue)
                                    this.setState({value : newValue})
                                  })}
                                  inputValue={this.state.inputValue}
                                  onInputChange={(event, newInputValue) => {
                                    // if(this.state.inputValue != ''){
                                    //   newInputValue = this.state.inputValue
                                    // }                                    
                                    this.handleInputChange(newInputValue)
                                  }}
                                  id="controllable-states"
                                  options={listProductName}
                                  sx={{width : 600}}
                                  renderInput={(params) => <TextField {...params} label="Name Product" />}
                                />
                                {/* <input name="nameProduct" onChange={this.handleChange} value={nameProduct} type="text" className="form-control" /> */}
                            </div>
                        </div>
                        <div className="line" />
                          <div className="form-group row">
                            <label className="col-sm-3 form-control-label">productId</label>
                            <div className="col-sm-3">
                                <input name="pId" onChange={this.handleChange} disabled value={pId} type="number" className="form-control" />
                            </div>
                            {/* <label htmlFor="fileInput" className="col-sm-3 form-control-label">Image</label> */}
                            <div className="col-sm-3">
                                <div className="fix-cart">
                                    <img src={image || 'http://via.placeholder.com/400x300'} id="output" className="fix-img" alt="avatar" />
                                </div> 
                            </div>
                          </div>
                        <div className="line" />
                        <div className="form-group row">
                          <label className="col-sm-3 form-control-label">ids</label>
                          <div className="col-sm-3">
                            <input name="pdId" onChange={this.handleChange} value={pdId} type="string" className="form-control" />
                          </div>
                          <label className="col-sm-3 form-control-label" style={{textAlign: 'center'}}>Type</label>
                          <div className="col-sm-3">
                            <input name="type" onChange={this.handleChange} value={type} type="string" className="form-control" />
                          </div>
                        </div>  
                        <div className="line" />
                        <div className="line" />
                      <div className="form-group row">
                        <label className="col-sm-3 form-control-label">Note</label>
                        <div className="col-sm-9">
                          <input name="note" onChange={this.handleChange} value={note} type="note" placeholder="Note" className="form-control" />
                        </div>
                      </div>
                        {/* {this.displayInput()} */}
                        <div className="line" />
                            <div className="form-group row">
                                <Link to="/productreport"><button type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Cancel</button></Link>
                                <div className="col-sm-4 offset-sm-3">
                                    {/* <Link to="/import"><button type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Cancel</button></Link> */}
                                    <button style={{ marginRight: 6 }} className="btn btn-dark" onClick={() => this.handleAddToReport()}>Add </button>
                                    {/* <button type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Cancel</button> */}
                                    <button type="button" className="btn btn-primary" onClick={() => 
                                        this.createReport({
                                        storeName: this.state.user[0].name,
                                        userName: this.state.user[0].name + " admin",
                                        listOfReports: this.state.reportList
                                        })
                                    }>Create</button>
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
    fetch_products: (token, offset, storename) => {
        return dispatch(actFetchProductsRequest(token, offset, storename))
    },
    
    create_report: (payload, token) => {
      //eslint-disable-next-line no-undef
        return dispatch(actCreateReport(payload, token))
    }
  }
}
export default connect(null, mapDispatchToProps)(ActionReportProduct)