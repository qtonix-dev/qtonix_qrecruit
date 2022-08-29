import API from "../api/API";
import cookie from 'react-cookies'

//GET SORTBYLISTS TYPE
export const getUserInformation = () => async (dispatch) => {
    // const response = await API.get('/getLessons', {params: params});
    // dispatch({ type: "USER_INFORMATION", payload: response.data.results });

    dispatch({ type: "USER_INFORMATION", payload:111 });

};
