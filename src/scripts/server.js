//X-Access-Token
const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzAzMTEyMDMsInVzZXJuYW1lIjoic3lzYWRtaW4ifQ.y3PfyD9tEffddXoaSWfthCLluW0W5vwCvMvADPr0zPE";

export const auth = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json; charset=UTF-8",
  },
};

export const server = "http://123.60.222.136:20001/glory-shjr/bus/countTemp/";