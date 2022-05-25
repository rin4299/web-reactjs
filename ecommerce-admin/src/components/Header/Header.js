import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { actToken, actGetNameRole  } from '../../redux/actions/auth'
import { startLoading, doneLoading } from '../../utils/loading'
import { actFetchCartRequest } from '../../redux/actions/cart';


let token;
class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // Countcart : 0,
    }
  }

  componentDidMount() {
    token = localStorage.getItem('_auth');
    // cart = JSON.parse(localStorage.getItem('_cart'))
    // this.state.Countcart = cart.length
  }

  logOut = async () => {
    localStorage.removeItem('_auth');
    const token = null;
    startLoading();
    const setToken = this.props.setTokenRedux(token);
    const setRole = this.props.setTokenRoleRedux(token);
    await Promise.all([setToken, setRole])
    doneLoading();
  }
  render() {
    let count;
    // const { cart } = fetch_items();
    // console.log('header', cart)
    
    // console.log('localStorage',JSON.parse(localStorage.getItem('_cart')))
    // this.setState({
    //   cart : JSON.parse(localStorage.getItem('_cart'))
    // })
    // cart = JSON.parse(localStorage.getItem('_cart'))
    const { cart } = this.props
    // console.log('cart in header', cart)
    if (cart.length > 0) {
      count = cart.reduce((sum, item) => {
        return sum += item.quantity
      }, 0)
    }
    
    return (
      <header className="header" >
        <nav className="navbar" style={{"backgroundColor":"#005dfe"}}>
          {/* Search Box*/}
          <div className="search-box">
            <button className="dismiss"><i className="icon-close" /></button>
            <form id="searchForm" action="#" role="search">
              <input type="search" placeholder="What are you looking for..." className="form-control" />
            </form>
          </div>
          <div className="container-fluid">
            <div className="navbar-holder d-flex align-items-center justify-content-between">
              {/* Navbar Header*/}
              <div className="navbar-header">
                {/* Navbar Brand */}<Link to="/" className="navbar-brand d-none d-sm-inline-block">
                  <div className="brand-text d-none d-lg-inline-block"><strong>Admin BKStore</strong></div></Link>
              </div>
              {/* Navbar Menu */}
              <ul className="nav-menu list-unstyled d-flex flex-md-row align-items-md-center">
                {/* Search*/}
                {/* <li className="nav-item d-flex align-items-center"><Link id="search" to="#"><i className="icon-search" /></Link></li> */}
                {/* Notifications*/}
                {/* <li className="nav-item dropdown"> <a id="notifications" rel="nofollow" data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="nav-link"><i className="fa fa-bell-o" /><span className="badge bg-red badge-corner">1</span></a>
                  <ul aria-labelledby="notifications" className="dropdown-menu">
                    <li><Link rel="nofollow" to="#" className="dropdown-item">
                      <div className="notification">
                        <div className="notification-content"><i className="fa fa-envelope bg-green" />You have 6 new messages </div>
                        <div className="notification-time"><small>4 minutes ago</small></div>
                      </div></Link></li>
                    <li><Link rel="nofollow" to="#" className="dropdown-item all-notifications text-center"> <strong>view all notifications</strong></Link></li>
                  </ul>
                </li> */}
                {/* Languages dropdown    */}
                <li className="nav-item dropdown"><a id="languages" rel="nofollow" data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="nav-link language dropdown-toggle"><img src="https://i.ibb.co/QrtCN5s/GB.png" alt="English" /><span className="d-none d-sm-inline-block">English</span></a>
                  <ul aria-labelledby="languages" className="dropdown-menu">
                    <li><Link rel="nofollow" to="#" className="dropdown-item"> <img src="https://i.ibb.co/QrtCN5s/GB.png" alt="English" className="mr-2" />German</Link></li>
                    <li><Link rel="nofollow" to="#" className="dropdown-item"> <img src="https://i.ibb.co/SnpwbfX/VN.png" alt="English" className="mr-2" />Viet Nam</Link></li>
                  </ul>
                </li>
                {/* Begin Header Mini Cart Area */}
                <li className="nav-item">
                    <Link to="/requestcart">
                      <div className="nav-link logout">
                        <span className="item-icon" />
                        <span className="item-text">
                          <span className="cart-item-count">{count ? count : 0}<i className="fas fa-shopping-cart" /></span> 
                        </span>
                      </div>
                    </Link>
                    <span />
                  </li>
                {/* Logout    */}
                <li className="nav-item"><Link onClick={this.logOut} to="/login" className="nav-link logout"> <span className="d-none d-sm-inline">Logout</span><i className="fa fa-sign-out" /></Link></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    )
  }
}

// const mapStateToProps = (state) => {
//   console.log('state.cart',state)
//   return {
//     countCart: state.cart,
//     countFavorite: state.favorites
//   }
// }

const mapStateToProps = (state) => {
  // console.log('state', state)
  return {
    cart: state.cart
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    setTokenRedux: (token) => {
      dispatch(actToken(token))
    },
    setTokenRoleRedux: (token) => {
      dispatch(actGetNameRole(token))
    },
    fetch_items: () => {
      dispatch(actFetchCartRequest())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)