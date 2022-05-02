import React, { Component } from 'react'
import './style.css'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {actFetchReportDetail, actFetchReportRequest} from '../../../redux/actions/productreport'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import MyFooter from 'components/MyFooter/MyFooter'
import Paginator from 'react-js-paginator';
import callApi from '../../../utils/apiCaller';
import  DatePicker  from 'react-datepicker';
import Modal from 'react-bootstrap/Modal'
const MySwal = withReactContent(Swal)

let token;


class ProductReport extends Component {

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      currentPage: 1,
      searchText: '',
      modalShow: false,
      user: [],
      id:0,
      history:'',
      total2:0,
      ReportDetail:'',
      // startDate: new Date(),
      // endDate : '',
      dateRange: [null,null],
      isOldest: true,
      modalShow : false,
      Newest : 'Newest',
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
        // console.log("user",this.state.user)
      }
    } else {
      this.setState({
        redirect: true
      })    
    }
    await this.fetch_reload_data(); 
  }

  fetch_reload_data(){
    token = localStorage.getItem('_auth');
    // console.log("id", this.state.user[0].name);
    // this.props.fetchImport(this.state.user[0].name,token)
    this.props.fetchReport(this.state.user[0].name,token).then(res => {
      res = res.sort((a,b)=> {
        return new Date(a.createdAt) < new Date(b.createdAt)
      })
      console.log('reload',this.state.Newest)

      if(this.state.Newest != 'Newest'){
        res = res.reverse()
        console.log('reload2',this.state.Newest)
      }
      this.setState({
        total: res,
        total2: res.slice(0,10)
        // .sort((a,b)=> {
        //   return new Date(a.latestUpdate) < new Date(b.latestUpdate)
        // })
      })
      // this.sortNewest()
    }).catch(err => {
      console.log(err)
    })

  }

  pageChange(content){
    const limit = 10;
    const offset = limit * (content - 1);
    this.setState({
      currentPage: content,
      total2: this.state.total.slice(offset, offset + 10),
    })
    window.scrollTo(0, 0);
  }
/////////////////////////
  filterText = (event) => {

    const keyword = event.target.value
    this.setState({
      searchText: keyword
    });
    if(keyword !== ''){
      // console.log('test',this.state.total,keyword)
      const result = this.state.total.filter((item)=> {
        return item.id == keyword ;
      }).sort((a,b)=> {
        return new Date(a.createdAt) < new Date(b.createdAt)
      })
      // console.log('result', result)

      this.setState({
        total: result,
        total2: result.slice(0,10)
      })
    }else{
      this.fetch_reload_data()
    }
  }

  sortNewest = (event) => {
    const { total2, Newest } = this.state
    this.setState({
      Newest : event.target.value
    })
    const value = event.target.value
    if(Array.isArray(total2)){
      // console.log('total2', total2)
      if(value == 'Newest'){
        console.log('Newest')
        this.setState({
          total2 : total2.sort((a,b)=> {
            return new Date(a.createdAt) < new Date(b.createdAt)
          })
        })
      }else {
        console.log('Oldest')
        this.setState({
          total2 : total2.sort((a,b)=> {
            return new Date(a.createdAt) > new Date(b.createdAt)
          })
        })
      }
    }
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
        // await this.props.delete_product(id, token);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  // handleChange = (event) => {
  //   const target = event.target;
  //   const value = target.type === 'checkbox' ? target.checked : target.value;
  //   const name = target.name;
  //   this.setState({
  //     [name]: value
  //   });
  // }

  async find_report_detail (id){
    token = localStorage.getItem('_auth');
    // console.log('find thanh cong', id, token)
    this.props.fetchReportDetail(id,token).then(res => {
        console.log(res)
        this.setState({
            ReportDetail: res,
            modalShow : true,
        })
        }).catch(err => {
        console.log(err)
    }) 
    // if (token) {
    //     const res = await callApi(`import/getInformation?id=${id}`, "GET", null, token);
    //     if (res && res.status === 200) {
    //         console.log(res.data)
    //       this.setState({
    //         ReportDetail: res.data,
    //         modalShow : true,
    //       })
    //       // console.log("user",this.state.user)
    //     }
    //   } else {
    //     this.setState({
    //       redirect: true
    //     })    
    //   } 

  }

  sortByDate(){
    const {total2} = this.state;
    if(Array.isArray(total2)){
      let temp2 = total2.sort((a,b)=> {
        return new Date(a.latestUpdate) > new Date(b.latestUpdate)
      })
      this.setState({
        total2 : temp2
      })
    }
  }

  MyVerticallyCenteredModal = (props) => {
    // let temp = Object.keys(this.state.ReportDetail)
    // let date = new Date(props.history.times)
    // date = date.toDateString()
    // console.log('reportdetail',this.state.ReportDetail)
    let detail = this.state.ReportDetail 
    return (
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        // dialogClassName="modal-200w"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Import Detail
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{overflow: 'auto'}}>
          {/* {console.log('test ReportDetail', this.state.ReportDetail)} */}
          
          <div >
            {this.state.ReportDetail ? 
            <form >
              <div className="table-responsive">
                <table className="table table-hover" style={{ textAlign: "center" }}>
                  <thead>
                    <tr>
                        <th>Id-Report</th>
                        <th>Id-product</th>
                        <th>Name Product</th>
                        <th>Image</th>
                        <th>Quantity</th>
                        <th>ids</th>
                        <th>Type</th>
                        <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    {detail ? detail.map((item,index)=>{
                      {/* detail = this.state.ReportDetail[item] */}
                      return(
                        <tr key = {index}>
                            <td><span className="text-truncate" >{item.id}</span></td>
                            <td><span className="text-truncate" >{item.pId}</span></td>
                            <td><span  >{item.product.nameProduct}</span></td>
                            <td>
                                <div className="fix-cart">
                                <img src={item.product.image ? item.product.image : null} className="fix-img" alt="not found" />
                                </div>
                            </td>
                            <td><span className="text-truncate" >{item.quantity}</span></td>
                            <td><span className="text-truncate" >{item.pdId}</span></td>
                            <td><span className="text-truncate" >{item.type}</span></td>
                            <td><span className="text-truncate" ><p>{item.note}</p></span></td>
                        </tr>
                      )
                    }) : null}
                  </tbody>
                </table>
              </div>
            </form>
            : null
            }
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <button type="button" class="btn btn-info" onClick={props.onHide}>Close</button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    // let { requests } = this.props;
    const {total, total2} = this.state;
    // this.sortByDate()
    // console.log(total2)
    const [startDate, endDate] = this.state.dateRange
    const { searchText } = this.state;
    // this.sortNewest()
    return (
      <div className="content-inner">
        {/* Page Header*/}
        <header className="page-header">
          <div className="container-fluid">
            <h2 className="no-margin-bottom">Product Report</h2>
            {/* <div class="btn-group">
                <button class="button"><Link to="/requests"> <i style ={{}}/>Requests</Link></button>
                <button class="button"><Link to="/yourrequests"> <i style ={{}}/>Your Requests</Link></button>
                <button class="button"><Link to="/historyrequest"> <i style ={{}}/>History</Link></button>
            </div> */}
          </div>
        </header>
        {/* Breadcrumb*/}
        <div className="breadcrumb-holder container-fluid">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Product Report</li>
          </ul>
        </div>
        <section className="tables pt-3">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex align-items-center">
                    <h3 className="h4">Product Report List</h3>
                  </div>
                    
                    <div style={{justifyContent: 'flex-end', paddingTop: 5, paddingRight: 20, marginLeft:"auto" }} class="btn-group">
                    {/* <DatePicker
                      style={{width:''}}
                      // selected={startDate}
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(date)=> {
                        console.log(date)
                      }}

                      dateFormat='dd/MM/yyyy'
                      isClearable={true}
                      placeholderText='Date ...'
                    /> */}
                    <select name="sorting" defaultChecked={this.state.Newest} onChange={(event) => {
                                                                                                      this.sortNewest(event)                                                                                                      
                                                                                                  }} >
                      <option name='Newest' value='Newest'>Newest</option>
                      <option name='Newest' value='Oldest'>Oldest</option>
                    </select>      
                      <input
                        name="searchText"
                        onChange={this.filterText}
                        value={searchText}
                        className="form-control form-control-sm ml-3 w-75" type="text" placeholder="Search"
                        aria-label="Search" />
                        <Link to='productreport/add' className='btn btn-primary' style={{marginLeft:'20px'}}>Create</Link>
                        {/* <button onClick={this.myFunction()}>add row</button> */}
                    </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover" style={{ textAlign: "center" }}>
                        <thead>
                          <tr>
                            <th>Number</th>
                            <th>Id</th>
                            <th>Storename</th>
                            <th>CreatedBy</th>
                            <th>CreatedAt</th>
                            <th>UpdateAt</th>
                          </tr>
                        </thead>
                        <tbody>
                            <this.MyVerticallyCenteredModal
                                show={this.state.modalShow}
                                onHide={() => this.setState({modalShow: false})}
                            />
                            {total2 && total2.length ? total2.map((item, index) => {
                            {/* console.log('item',item) */}
                              return (
                              <tr key={index} id="myrow" onClick={()=>{ this.find_report_detail(item.id)}}>
                                <th scope="row">{index + 1}</th>
                                <td><span className="text-truncate" >{item.id}</span></td>
                                <td><span className="text-truncate" >{item.storeName}</span></td>
                                <td><span className="text-truncate" >{item.createdBy}</span></td>
                                <td><span className="text-truncate" >{new Date(item.createdAt).toDateString()}</span></td>
                                <td><span className="text-truncate" >{new Date(item.updatedAt).toDateString()}</span></td>
                                {/* <td ><span style={{width:"auto"}}>{time}</span></td>
                                <td>
                                  <div>
                                    <button class="btn btn-info" onClick={() => {this.setState({modalShow: true, history : item })
                                                                                this.find_product_detail(item.listofProductDetail)}
                                    }>View More</button>
                                    <this.MyVerticallyCenteredModal
                                        show={this.state.modalShow}
                                        onHide={() => this.setState({modalShow: false})}
                                        history ={{times : time}}
                                      />
                                  </div>
                                </td> */}
                              </tr>
                              )
                            {/* }                            */}
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
    fetchReportDetail: (id , token) => {
      return dispatch(actFetchReportDetail(id, token))
    },
    fetchReport: (storename, token) => {
        return dispatch(actFetchReportRequest(storename, token))
    },
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(ProductReport)