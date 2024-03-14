import {post, get} from "aws-amplify/api";

export const testAuth = async (token)=>{
    debugger;
    const restOperation = get({
        apiName: "backend",
        path: `/api/ping`,
        options:{
            headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
            
        },
    });
    const {body} = await restOperation.response;
    return await body.json();
}