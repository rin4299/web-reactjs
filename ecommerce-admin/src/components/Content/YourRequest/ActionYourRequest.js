import React, { Component } from 'react'
import MyFooter from '../../MyFooter/MyFooter'
import { actAddProducerRequest, actGetProducerRequest, actEditProducerRequest } from '../../../redux/actions/producer';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import callApi from '../../../utils/apiCaller';
import { css } from '@emotion/core';
import { Link } from 'react-router-dom'
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
    };
    id = this.props.id
  }

  async componentDidMount() {
    token = localStorage.getItem('_auth');
    
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


  render() {
    const { name, desc,redirectToYourRequest} = this.state;
    if (redirectToYourRequest) {
      return <Redirect to='/yourrequests'></Redirect>
    }
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
                            <input name="name" onChange={this.handleChange} value={name} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="line" />
                        <div className="form-group row">
                            <label className="col-sm-3 form-control-label">To</label>
                            <div className="col-sm-9">
                            <input name="desc" onChange={this.handleChange} value={desc} type="text" placeholder="Note" className="form-control" />
                            </div>
                        </div>
                        {id ? <div>
                            <div className="form-group row">
                                <label className="col-sm-3 form-control-label" style={{paddingTop: 50}}>Items</label>
                                <div className="col-sm-9">
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                <tr>
                                                    <th>Number</th>
                                                    <th>Product</th>
                                                    <th>Image</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {/* {dataOrderDetails && dataOrderDetails.length ? dataOrderDetails.map((item, index) => {
                                                    return (
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item.nameProduct}</td>
                                                        <td>
                                                        <div className="fix-cart">
                                                            <img src={item && item.product ? item.product.image : null} className="fix-img" alt="not found" />
                                                        </div>
                                                        </td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.quantity * item.price}</td>
                                                    </tr>
                                                    )
                                                }) : null}
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td><b style={{fontSize: 16}}>Item Amount: </b></td>
                                                <td><b style={{fontSize: 16}}>${orderDetailAmount}</b></td> */}
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
                                <Link to="/producers"><button type="reset" className="btn btn-secondary" style={{ marginRight: 2 }}>Cancel</button></Link>   
                                <button type="submit" className="btn btn-primary">Save changes</button>
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
    }
  }
}
export default connect(null, mapDispatchToProps)(ActionYourRequest)