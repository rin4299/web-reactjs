import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
// import { toast } from 'react-toastify';
import { actShowLoading, actHiddenLoading } from './loading'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';



    export const actFetchReportRequest = (storeName, token) => {
        return dispatch => {
        dispatch(actShowLoading());
        return new Promise((resolve, reject) => {
            // console.log('after send id', id)
            callApi(`productreport/getReport?storeName=${storeName}`, 'GET', null, token)
            .then(res => {
                if (res && res.status === 200) { 
                dispatch(actFetchReport(res.data));
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

    export const actFetchReport = (data) => {
        return {
        type : Types.FETCH_REPORT,
        data
        }
    }



    export const actCreateReport = (payload, token) => {
        return dispatch => {
        dispatch(actShowLoading());
        return new Promise((resolve, reject) => {
            callApi(`productreport/create`, 'POST', payload, token)
            .then(res => {
                if (res && res.status === 200) { 
                dispatch(actCreateReportDispatch(res.data));
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
    
    export const actCreateReportDispatch = (data) => {
        return {
            type: Types.CREATE_REPORT,
            data
        }
    }

    export const actFetchReportDetail = (id, token) => {
        // return async dispatch => {
        //     const res = callApi(`productreport/getInformation?id=${id}`, "GET", null, token);
        //     if (res && res.status === 200) {
        //         dispatch(actReportDetail(res.data));
        //         setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
        //     }
        // }
        return dispatch => {
            dispatch(actShowLoading());
            return new Promise((resolve, reject) => {
                callApi(`productreport/getInformation?id=${id}`, "GET", null, token)
                .then(res => {
                    if (res && res.status === 200) { 
                    dispatch(actCreateReportDispatch(res.data));
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
    }
    export const actReportDetail = (data) => {
        return {
            type: Types.FIND_REPORT,
            data
        }
    }