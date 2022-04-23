import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
// import { toast } from 'react-toastify';
import { actShowLoading, actHiddenLoading } from './loading'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';



    export const actFetchImportRequest = (storeName, token) => {
        return dispatch => {
        dispatch(actShowLoading());
        return new Promise((resolve, reject) => {
            // console.log('after send id', id)
            callApi(`import/getImports?storeName=${storeName}`, 'GET', null, token)
            .then(res => {
                if (res && res.status === 200) { 
                dispatch(actFetchImport(res.data));
                resolve(res.data);
                // console.log(res.data)
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

    export const actFetchImport = (data) => {
        return {
        type : Types.FETCH_IMPORT,
        data
        }
    }

    export const actCreateImport = (token, payload) => {
        // return async dispatch => {
        // const res = callApi(`import/create`, 'POST', payload, token)
        // console.log('result', res)
        //     if (res && res.status === 200) {
        //         toast.success('New Import is created')
        //         dispatch(actCreateImportDispatch(res.data));
        //     }
        // }
        
          return dispatch => {
            dispatch(actShowLoading());
            return new Promise((resolve, reject) => {
              callApi(`import/create`, 'POST', payload, token)
                .then(res => {
                  if (res && res.status === 200) { 
                    dispatch(actCreateImportDispatch(res.data));
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
    
      export const actCreateImportDispatch = (data) => {
        return {
            type: Types.CREATE_IMPORT,
            data
        }
      }