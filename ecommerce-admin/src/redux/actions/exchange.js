import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
import { toast } from 'react-toastify';
import { actShowLoading, actHiddenLoading } from './loading'
import 'react-toastify/dist/ReactToastify.css';

export const actFetchExchangeRequest = (id, token) => {
//   const newOffset = offset === null || offset === undefined ? 0 : offset;
//   const limit = 10;
  let payload = {"id" : id, "type": "recUserName"}
  return dispatch => {
    dispatch(actShowLoading());
    return new Promise((resolve, reject) => {
      callApi(`exchange`, 'POST', payload, token)
        .then(res => {
          if (res && res.status === 200) { 
            dispatch(actFetchExchangeReq(res.data));
            resolve(res.data);
            setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
          setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
        });
    });
  };
};

export const actFetchExchangeReq = (data) => {
  return {
      type: Types.FETCH_EXCHANGE_REQUEST,
      data
  }
}

export const actFetchExchangeReceive = (id, token) => {
  //   const newOffset = offset === null || offset === undefined ? 0 : offset;
  //   const limit = 10;
    let payload = {"id" : id, "type": "reqUserName"}
    return dispatch => {
      dispatch(actShowLoading());
      return new Promise((resolve, reject) => {
        callApi(`exchange`, 'POST', payload, token)
          .then(res => {
            if (res && res.status === 200) { 
              dispatch(actFetchExchangeRec(res.data));
              resolve(res.data);
              setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
            }
          })
          .catch(err => {
            console.log(err);
            reject(err);
            setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
          });
      });
    };
  };

  export const actFetchExchangeRec = (data) => {
    return {
        type: Types.FETCH_EXCHANGE_RECEIVE,
        data
    }
  }

export const actCreateExchange = (token, payload) => {
    //   const newOffset = offset === null || offset === undefined ? 0 : offset;
    //   const limit = 10;
      return dispatch => {
        dispatch(actShowLoading());
        return new Promise((resolve, reject) => {
          callApi(`exchange/createExchange`, 'POST', payload, token)
            .then(res => {
              if (res && res.status === 200) { 
                // console.log('2', res.data)
                dispatch(actCreateExchangeDispatch(res.data));
                
                resolve(res.data);
                setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
              }
            })
            .catch(err => {
              console.log(err);
              reject(err);
              setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
            });
        });
      };
    };

  export const actCreateExchangeDispatch = (data) => {
    return {
        type: Types.CREATE_EXCHANGE,
        data
    }
  }

export const actUpdateAccept = (payload, token) => {
    return dispatch => {
      dispatch(actShowLoading());
      return new Promise((resolve, reject) => {
        callApi(`exchange/accept`, 'POST', payload, token)
          .then(res => {
            if (res && res.status === 200) { 
              console.log(res.data)
              dispatch(actFetchExchangeReq(res.data));
              resolve(res.data);
              setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
            }
          })
          .catch(err => {
            console.log(err);
            reject(err);
            setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
          });
      });
    };
  };

  export const actUpdateAcceptDispatch = (data) => {
    return {
        type: Types.UPDATE_ACCEPT,
        data
    }
  }

  export const actUpdateConfirm = (payload, token) => {
      return dispatch => {
        dispatch(actShowLoading());
        return new Promise((resolve, reject) => {
          callApi(`exchange/confirm`, 'POST', payload, token)
            .then(res => {
              if (res && res.status === 200) { 
                dispatch(actUpdateConfirmDispatch(res.data));
                resolve(res.data);
                setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
              }
            })
            .catch(err => {
              console.log(err);
              reject(err);
              setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
            });
        });
      };
    };

  export const actUpdateConfirmDispatch = (data) => {
    return {
        type: Types.UPDATE_CONFIRM,
        data
    }
  }


  export const actupdateConfirmWrong = (payload, token) => {
    return dispatch => {
      dispatch(actShowLoading());
      return new Promise((resolve, reject) => {
        callApi(`exchange/confirmwrong`, 'POST', payload, token)
          .then(res => {
            if (res && res.status === 200) { 
              dispatch(actupdateConfirmWrongDispatch(res.data));
              resolve(res.data);
              setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
            }
          })
          .catch(err => {
            console.log(err);
            reject(err);
            setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
          });
      });
    };
  };

export const actupdateConfirmWrongDispatch = (data) => {
  return {
      type: Types.UPDATE_CONFIRM_WRONG,
      data
  }
}

  export const actGetManyDiff = (id, token) => {
    return dispatch => {
      dispatch(actShowLoading());
      return new Promise((resolve, reject) => {
        callApi(`admindiff/${id}`, 'GET', null, token)
          .then(res => {
            if (res && res.status === 200) { 
              dispatch(actFetchExchangeReq(res.data));
              resolve(res.data);
              setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
            }
          })
          .catch(err => {
            console.log(err);
            reject(err);
            setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
          });
      });
    };
  };

  export const actGetManyDiffDispatch = (data) => {
    return {
      type : Types.GET_MANY_DIFF,
      data
    }
  }

  export const actHistoryRequest = (id, token) => {
    return dispatch => {
      dispatch(actShowLoading());
      return new Promise((resolve, reject) => {
        callApi(`history/${id}`, 'GET', null, token)
          .then(res => {
            if (res && res.status === 200) { 
              // dispatch(actHistoryRequest(res.data));
              resolve(res.data);
              setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
            }
          })
          .catch(err => {
            console.log(err);
            reject(err);
            setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
          });
      });
    };

  };

  export const actHistoryRequestDispatch = (data) => {
    return {
      type : Types.HISTORY_REQUEST,
      data
    }
  }

  export const actDeleteRequest = (id, token) => {
    return async dispatch => {
      await callApi(`exchange/delete/${id}`, "GET", null, token);
      dispatch(actDeleteRequestDispatch(id));
    };
  };

  export const actDeleteRequestDispatch = id => {
    return {
      type: Types.REMOVE_REQUEST,
      id
    };
  };

  export const actFetchProductDetail = (str, token) => {
    return dispatch => {
      dispatch(actShowLoading());
      return new Promise((resolve, reject) => {
        callApi(`getproductdetaillist/${str}`, "GET", null, token)
          .then(res => {
            if (res && res.status === 200) {
              dispatch(actFetchProductDetailRequest(res.data.results));
              resolve(res.data);
              setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
            }
          })
          .catch(err => {
            console.log(err);
            reject(err);
            setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
          });
      });
    };
  };
  
  export const actFetchProductDetailRequest = data => {
    return {
      type: Types.PRODUCT_DETAILS_LIST,
      data
    };
  };