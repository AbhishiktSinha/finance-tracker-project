import axios from "axios";
import { consoleError, consoleInfo } from "../console_styles";

export default async function request(httpConfig) {

    console.log('AXIOS CONFIG:', httpConfig);

    try {
        const data = await axios(httpConfig);
        consoleInfo('RECIEVED DATA FROM NETWORK')
        
        const {status} = data;
        if ( !(status >= 200 && status < 300)) {
            throw new Error('INVALID REQUEST');
        }

        return {
            success: true,
            data: data,
            error: ''
        }
    }
    catch(e) {
        consoleError(e.message ? e.message : e);
        return {
            success: false,
            data: null,
            error: e
        }
    }
}