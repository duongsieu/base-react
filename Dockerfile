### STAGE 1: Build ###

# Create the image based on the official Node 12 image from Dockerhub
FROM node:12.2.0-alpine as build-stage

# Create a new directory
RUN mkdir -p /app

# Change directory so that our commands run inside this new directory
WORKDIR /app

# Copy dependency definitions
COPY package.json /app

# Install dependencies using yarn
RUN yarn

# Get all the code needed to run the app
COPY . /app

# Build the app
RUN yarn run build

### STAGE 2: Production Environment ###

# Create image based on the official nginx - Alpine image
FROM nginx:1.16.0-alpine

COPY --from=build-stage /app/build /usr/share/nginx/html

# nginx.conf to configure nginx because of react routing
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]