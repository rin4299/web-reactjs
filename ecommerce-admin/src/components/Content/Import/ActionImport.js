import React, { Component } from 'react'
import MyFooter from '../../MyFooter/MyFooter'
import 'react-quill/dist/quill.snow.css';
import {actFetchProductsRequest } from '../../../redux/actions/product';
import {actCreateImport} from '../../../redux/actions/import';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import callApi from '../../../utils/apiCaller';
import { css } from '@emotion/core';
import { Link } from 'react-router-dom'
import './style.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
import { DropDownListComponent, AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns';
// import {AutoComplete } from 'antd';
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
class ActionImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameProduct: '',
      pId: 0,
      quantity: 0,
      redirectToProduct: false,
      user: [],
      product:[],
      productAdd:{},
      importList: [],
      image:''
    };
    id = this.props.id
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
        this.setState({
          product: res,
        });
      }).catch(err => {
        console.log(err);  
      }) 

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
    if(item){
        this.setState({
            productAdd: item,
            pId: item.id,
            image: item.image
        });  
    }
      
  }

  handleAddToImport = () =>{
    let item = this.state.productAdd
    if (item){
        // let newList = [...this.state.importList, {pId:item.id,pName:item.nameProduct, quantity: 1}]
        // console.log('newList',newList)
        this.setState({
            importList : [...this.state.importList, {pId:item.id,pName:item.nameProduct, quantity: 1}]
        })
    }
  }

  handleRemove = (pId) => {
    let newList = [...this.state.importList]
    newList.map((item,index)=>{
        if(item.pId === pId){
            newList.splice(index,1)
        }
    })
    this.setState({
        importList : newList
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    
  }

  createImport = (payload) => {
    token = localStorage.getItem('_auth');
    // console.log(payload)
    if(token){
        this.props.create_import(token, payload).then(res => {
            console.log(res)
            this.setState({
                importList:''
            })
        })
    }
    toast.success('New Import is created');
  }

  render() {
    const { nameProduct, pId, quantity, importList, product, image} = this.state;
    // let test = this.state.importList;
    //  console.log('test2',importList)
    
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Form Import</h2>
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Home</a></li>
            <li className="breadcrumb-item active">Import</li>
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
                            <th>Product Name</th>
                            {/* <th>Address</th> */}
                            <th>Quantity</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {importList && importList.length ? importList.map((item,index)=>{
                            return(
                                <tr key={index}>
                                    <td>{item.pId}</td>
                                    <td>{item.pName}</td>
                                    {/* <td>{item.quantity}</td> */}
                                    <input name="quantity" onChange={(event)=>{
                                        console.log(item.pId)
                                        const value = event.target.value;
                                        // let temp_state = this.state.importList
                                        this.setState({
                                            importList : importList.map((object)=>{
                                            if(object.pId === item.pId){
                                                return {
                                                    ...object,
                                                    quantity: value
                                                }
                                            }else return object;})
                                        })
                                    }} value={item.quantity} type="number" className="form-control" />
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
                                <AutoCompleteComponent
                                    dataSource={product}
                                    fields={{value:'nameProduct'}}
                                    onChange={this.handleChangeComplete}
                                ></AutoCompleteComponent>
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
                        {/* {this.displayInput()} */}
                        <div className="line" />
                            <div className="form-group row">
                                <Link to="/import"><button type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Cancel</button></Link>
                                <div className="col-sm-4 offset-sm-3">
                                    {/* <Link to="/import"><button type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Cancel</button></Link> */}
                                    <button style={{ marginRight: 6 }} className="btn btn-dark" onClick={() => this.handleAddToImport()}>Add </button>
                                    {/* <button type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Cancel</button> */}
                                    <button type="button" className="btn btn-primary" onClick={() =>

                                        this.createImport({
                                        storeName: this.state.user[0].name,
                                        userName: this.state.user[0].name + " admin",
                                        listOfProducts: this.state.importList
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
    create_import: (token, payload) => {
        return dispatch(actCreateImport(token, payload))
    }
  }
}
export default connect(null, mapDispatchToProps)(ActionImport)