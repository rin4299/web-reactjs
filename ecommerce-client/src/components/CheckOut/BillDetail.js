import React, { Component } from 'react'
import callApi from '../../utils/apiCaller';
let token;
export default class BillDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      provinces: null,
      states: null,
      name: '',
      address: '',
      phone: '',
      note: '',
      email:'',
      provinceData: '01',
      stateData: '001',
      lat: null,
      lng: null
    }
    this.autocomplete = null
  }

  async componentDidMount() {
    try {
      const myProvinces = await callApi('provinces', 'GET', null) 
      const myStates = await callApi('provinces/01/states', 'GET', null) //set static 
      this.setState({
        provinces: myProvinces.data,
        states:myStates.data
      })
      token = localStorage.getItem('_auth');
      const res = await callApi('users/me', 'GET', null, token);
      this.setState({
        name: res.data.results[0].name,
        email: res.data.results[0].email,
        phone: res.data.results[0].phone,
        address: res.data.results[0].address,
      })
      console.log(res.data.results[0])
    } catch (err) {
      console.log(err);
    }

    this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('autocomplete'), {})
    // let addressObject = this.autocomplete.getPlace()
    // console.log(addressObject)
    this.autocomplete.addListener("place_changed", () => {
      let addressObject = this.autocomplete.getPlace()
      console.log(addressObject.geometry.location.lat())
      console.log(addressObject.geometry.location.lng())
      this.setState({
        lat : addressObject.geometry.location.lat(),
        lng : addressObject.geometry.location.lng()
      })
    })
  }

  // handlePlaceSelect() {
  //   let addressObject = this.autocomplete.getPlace()
  //   console.log(addressObject)
  // }

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      [name]: value
    });
  }


  getBillingState = (event) => {
    return this.state; //ref react
  }

  handleChangeSelectProvince = async (event) => {
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const res = await callApi(`provinces/${value}/states`, 'GET', null)
    this.setState({
      states: res.data,
      provinceData: value,
      stateData: res.data[0].code
    })
  } //get value of province
  handleChangeSelectState = (event) => {
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      stateData: value
    })
  } // get value of state

  render() {
    const { provinces, states, provinceData, stateData, name, address, phone, note, email  } = this.state;
    return (
      <div className="col-lg-10 col-12" style={{margin: 'auto'}}>
         <form>
         <div className="checkbox-form">
           <h3>Shipping Address</h3>
           <div className="row">
             {/* <div className="col-md-6">
               <div className="country-select clearfix">
                 <label>Provinces <span className="required">*</span></label>
                 <select 
                 onChange={this.handleChangeSelectProvince} 
                 className="nice-select wide" 
                 name="provinces" value={provinceData}>
                   {
                     (provinces && provinces.length) ? provinces.map((province, index) => {
                       return (
                         <option key={index} value={province.code}>{province.name}</option>
                       )
                     }
                     ) : null
                   }
                 </select>
               </div>
             </div>
             <div className="col-md-6">
               <div className="country-select clearfix">
                 <label>States <span className="required">*</span></label>
                 <select onChange={this.handleChangeSelectState} className="nice-select wide" name="state" value={stateData} >
                 {
                     (states && states.length) ? states.map((state, index) => {
                       return (
                         <option key={index} value={state.code}>{state.name}</option>
                       )
                     }
                     ) : null
                   }
                 </select>
               </div>
             </div> */}
             <div className="col-md-6">
               <div className="checkout-form-list">
                 <label>Name <span className="required">*</span></label>
                 <input onChange={this.handleChange} type="text" name="name" value={name} />
               </div>
             </div>
             <div className="col-md-6">
               <div className="checkout-form-list">
                 <label>Phone  <span className="required">*</span></label>
                 <input onChange={this.handleChange} type="text" name="phone" value={phone} />
               </div>
             </div>
             <div className="col-md-12">
               <div className="checkout-form-list">
                 <label>Email <span className="required">*</span></label>
                 <input onChange={this.handleChange} placeholder="Email" type="text" name="email" value={email} />
               </div>
             </div>
             <div className="col-md-12">
               <div className="checkout-form-list">
                 <label>Address <span className="required">*</span></label>
                 <input id="autocomplete" onChange={this.handleChange} placeholder="Street address" type="text" name="address"  />
               </div>
             </div>
             <div className="col-md-12">
               <div className="order-notes">
                 <div className="checkout-form-list">
                   <label>Order Notes</label>
                   <textarea value={note} onChange={this.handleChange} id="checkout-mess" cols="30" rows="10" name="note" placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </form>
      </div>
    )
  }
}
