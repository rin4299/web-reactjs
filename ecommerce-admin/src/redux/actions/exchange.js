import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
import { toast } from 'react-toastify';
import { actShowLoading, actHiddenLoading } from './loading'
import 'react-toastify/dist/ReactToastify.css';

export const actFetchExchangeRequest = (id, token) => {
//   const newOffset = offset === null || offset === undefined ? 0 : offset;
//   const limit = 10;
  let payload = {"id" : id, "type": "reqUserName"}
  return dispatch => {
    dispatch(actShowLoading());
    return new Promise((resolve, reject) => {
      callApi(`exchange`, 'POST', payload, token)
        .then(res => {
          if (res && res.status === 200) { 
            //   console.log('req', res.data)
            dispatch(actFetchExchange(res.data));
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



export const actFetchExchange = (data) => {
    return {
        type: Types.FETCH_EXCHANGE_REQUEST,
        data
    }
}

