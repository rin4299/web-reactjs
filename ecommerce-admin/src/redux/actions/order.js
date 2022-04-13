import * as Types from "../../constants/ActionType";
import callApi from "../../utils/apiCaller";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { actShowLoading, actHiddenLoading } from './loading'

export const actFetchOrdersRequest = (token, offset, storename) => {
  const newOffset = offset === null || offset === undefined ? 0 : offset;
  const limit = 10;
  return dispatch => {
    dispatch(actShowLoading());
    return new Promise((resolve, reject) => {
      callApi(`orders/new/${storename}?limit=${limit}&offset=${newOffset}&orderBy=-createdAt`, "GET", null, token)
        .then(res => {
          if (res && res.status === 200) {
            dispatch(actFetchOrders(res.data.results));
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

export const actFetchOrders = orders => {
  return {
    type: Types.FETCH_ORDERS,
    orders
  };
};

// export const actFetchOrdersRequest2 = (token, storename) => {
//   return dispatch => {
//     dispatch(actShowLoading());
//     return new Promise((resolve, reject) => {
//       callApi(`orders/new/${storename}`, "GET", null, token)
//         .then(res => {
//           if (res && res.status === 200) {
//             dispatch(actFetchOrders2(res.data.results));
//             resolve(res.data);
//             setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
//           }
//         })
//         .catch(err => {
//           console.log(err);
//           reject(err);
//           setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
//         });
//     });
//   };
// };

// export const actFetchOrders2 = orders => {
//   return {
//     type: Types.FETCH_ORDERS2,
//     orders
//   };
// };


export const actFindOrdersRequest = (token, searchText) => {
  return dispatch => {
  dispatch(actShowLoading());
  return new Promise((resolve, reject) => {
    if (searchText !== undefined && searchText !== null && searchText !== '') {
      callApi(`orders?q=${searchText}`, "GET", null, token)
      .then(res => {
        if (res && res.status === 200) {
          dispatch(actFindOrders(res.data.results));
          resolve(res.data);
          setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
        }
      })
      .catch(err => {
        console.log(err);
        reject(err);
        setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
      });
    } else {
      callApi("orders", "GET", null, token)
      .then(res => {
        if (res && res.status === 200) {
          dispatch(actFindOrders(res.data.results));
          resolve(res.data);
          setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
        }
      })
      .catch(err => {
        console.log(err);
        reject(err);
        setTimeout(function(){ dispatch(actHiddenLoading()) }, 200);
      });
    }
  });
}
}

export const actFindOrders = orders => {
  return {
    type: Types.FIND_ORDERS,
    orders
  };
};

export const actDeleteOrderRequest = (id, token) => {
  return async dispatch => {
    await callApi(`orders/delete/${id}`, "GET", null, token);
    dispatch(actDeleteOrder(id));
  };
};

export const actDeleteOrder = id => {
  return {
    type: Types.REMOVE_ORDER,
    id
  };
};

export const actAddOrderRequest = (token, data) => {
  return async dispatch => {
    const res = await callApi("orders", "POST", data, token);
    if (res && res.status === 200) {
      toast.success("Add new order is success");
      dispatch(actAddOrder(res.data));
    }
  };
};

export const actAddOrder = data => {
  return {
    type: Types.ADD_ORDER,
    data
  };
};

export const actGetOrderRequest = (token, id) => {
  return async dispatch => {
    await callApi(`orders/${id}`, "GET", null, token);
  };
};

export const actEditOrderRequest = (token, id, data) => {
  return async dispatch => {
    const res = await callApi(`orders/${id}`, "PUT", data, token);
    if (res && res.status === 200) {
      toast.success("Edit order is success");
      dispatch(actEditOrder(res.data));
    }
  };
};

export const actEditOrder = data => {
  return {
    type: Types.EDIT_ORDER,
    data
  };
};

export const actFindOrderProductDetail = (token, id) => {
  return dispatch => {
    dispatch(actShowLoading());
    return new Promise((resolve, reject) => {
      callApi(`orders/productdetails/${id}`, "GET", null, token)
        .then(res => {
          if (res && res.status === 200) {
            dispatch(actFindOrderProductDetails(res.data.results));
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

export const actFindOrderProductDetails = orders => {
  return {
    type: Types.FIND_ORDER_PRODUCT_DETAILS,
    orders
  };
};