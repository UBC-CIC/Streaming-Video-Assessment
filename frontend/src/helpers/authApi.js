import {post, get} from "aws-amplify/api";
import {Amplify} from "aws-amplify";
import awsconfig from '../amplifyconfiguration.json';

export const testAuth = async (token)=>{
    Amplify.configure(awsconfig, {
        API: {
          REST: {
            headers: async () => {
              return { Authorization: token };
            }
          }
        }
      });
    const restOperation = get({
        apiName: "backend",
        path: "/api/ping",
        options:{
            headers: {
                        Authorization: token,
                        "Access-Control-Request-Headers": "Authorization",
                        "Access-Control-Request-Methods":"GET",
                        Accept: "application/json",
                    },
        },
    });
    console.log("rest op headers: ",restOperation.options);
    const {body} = await restOperation.response;
    return body;
}