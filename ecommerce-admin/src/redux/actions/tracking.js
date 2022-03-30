import * as Types from '../../constants/ActionType';
import callApi from '../../utils/apiCaller';
// import { toast } from 'react-toastify';
import { actShowLoading, actHiddenLoading } from './loading'
import 'react-toastify/dist/ReactToastify.css';



    export const actTrackingRequest = (id, token) => {
        return dispatch => {
        dispatch(actShowLoading());
        return new Promise((resolve, reject) => {
            // console.log('after send id', id)
            callApi(`tracking/${id}`, 'GET', null, token)
            .then(res => {
                if (res && res.status === 200) { 
                // dispatch(actHistoryRequest(res.data));
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

    export const actHistoryRequestDispatch = (data) => {
        return {
        type : Types.TRACKING_REQUEST,
        data
        }
    }