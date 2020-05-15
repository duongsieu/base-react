## How to run the application

### Run in your local computer
1. Install package

    `npm install`

2. Create the environment file from .env.example

    `cp .env.example .env`

3. Change .env file

4. Run the application

    `npm start`

5. See the application in your browser [http://localhost:3000](http://localhost:3000)

### Run in docker
1. Install package

    `npm install`

2. Create the environment file from .env.example

    `cp .env.example .env`

3. Change .env file

4. Run the build script with your params, example:

    `sudo BUILD_ENV=dev ENV_FILE=.env bash deploy/build-docker.sh`

5. See the application in your browser (replace *3000* by your *PORT*)

    [http://localhost:3000](http://localhost:3000)

## Main Packages
- [redux](https://redux.js.org/)
- [Ant Design of React](https://ant.design/docs/react/introduce)
- [Axios](https://github.com/axios/axios)
- [connected-react-router](https://github.com/supasate/connected-react-router)

## Convension
- Use ES6 (transpiled with Babel)
- Use Webpack
- Use JSX
- Always look at your bundle size
- Use [Eslint](https://eslint.org/docs/user-guide/getting-started)
- Keep your components small (Very Small)
- Use PropTypes to set data validation for components
- Avoid Refs

## Document
- [Tài liệu kỹ thuật của hệ thống quản trị ứng dụng dùng chung](https://drive.google.com/file/d/1PbXjI4DwyUCvVFNnooD7gecEVSMSC4JB/view)