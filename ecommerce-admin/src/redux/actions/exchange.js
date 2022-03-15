import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
// import { toast } from 'react-toastify';
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

export const actUpdateAccept = (id, token) => {
  //   const newOffset = offset === null || offset === undefined ? 0 : offset;
  //   const limit = 10;
    // let payload = {"id" : id, "type": "reqUserName"}
    // console.log("id" , id)
    return dispatch => {
      dispatch(actShowLoading());
      return new Promise((resolve, reject) => {
        callApi(`exchange/accept/${id}`, 'PUT', null, token)
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

  export const actUpdateConfirm = (id, token) => {
    //   const newOffset = offset === null || offset === undefined ? 0 : offset;
    //   const limit = 10;
      // let payload = {"id" : id, "type": "reqUserName"}
      // console.log("id" , id)
      return dispatch => {
        dispatch(actShowLoading());
        return new Promise((resolve, reject) => {
          callApi(`exchange/confirm/${id}`, 'GET', null, token)
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

export const actFetchExchangeRec = (data) => {
  return {
      type: Types.FETCH_EXCHANGE_RECEIVE,
      data
  }
}

export const actCreateExchangeDispatch = (data) => {
    return {
        type: Types.CREATE_EXCHANGE,
        data
    }
}

export const actUpdateAcceptDispatch = (data) => {
  return {
      type: Types.UPDATE_ACCEPT,
      data
  }
}

export const actUpdateConfirmDispatch = (data) => {
  return {
      type: Types.UPDATE_CONFIRM,
      data
  }
}