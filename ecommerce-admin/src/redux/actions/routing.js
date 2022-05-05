import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
// import { toast } from 'react-toastify';
import { actShowLoading, actHiddenLoading } from './loading'
import 'react-toastify/dist/ReactToastify.css';

    // export const actGenerateRouting = (storeName, token) => {
    //     return async dispatch => {
    //         await callApi(`routing/${storeName}`, 'GET', null, token);
    //     };
    // }


    // export const actGenerateRouting = (storeName, token) => {
    //     return async dispatch => {
    //       dispatch(actShowLoading());
    //         const res = await callApi(`routing/${storeName}`, 'GET', null, token);
    //         console.log('resR',res)
    //         if (res && res.status === 200) {
    //           dispatch(actGenerateRoutingDispatch(res.data));
    //         }
    //         setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
    //     };
    //   }

      export const actGenerateRouting = (storeName, token) => {
        return dispatch => {
          dispatch(actShowLoading());
          return new Promise((resolve, reject) => {
            callApi(`routing/${storeName}`, "GET", null, token)
              .then(res => {
                if (res && res.status === 200) {
                  dispatch(actGenerateRoutingDispatch(res.data));
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
      
      export const actGenerateRoutingDispatch = (data) => {
        return {
            type : Types.GENERATE_ROUTING,
            data
        }
      }


      export const actClearRequest = () => {
        return async dispatch => {
            // localStorage.setItem('_cart', JSON.stringify([]) );
            dispatch(actClearRouting());
        };
    }
    
    export const actClearRouting = (clear) => {
        return {
            type: Types.CLEAR_ROUTING
        }
    }