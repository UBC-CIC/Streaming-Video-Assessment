# Dropzone

To run the backend locally:
```
cd frontend/amplify/backend/function/api/src/
npm i
npm start
```

Make sure to connect local backend to frontend:

change in ```frontend/src/amplifyconfiguration.json```
```
"endpoint": https://swgcwu6tua.execute-api.ca-central-1.amazonaws.com/dev
```
to
```
"endpoint": "http://localhost:3000
```
