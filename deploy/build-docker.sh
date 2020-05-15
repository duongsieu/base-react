#!/bin/bash

#---------------------------------------------- Params ----------------------------------------------#
# Build environment type
# $BUILD_ENV (Required)
# - Valid values: live, staging, test, dev, local
# Environment file name
# $ENV_FILE (Optional)
#---------------------------------------------------------------------------------------------------#

#----------- STEP I/V - Check environment variables -----------#
echo "#----------- STEP I/V - Check environment variables -----------#"
if [ "$BUILD_ENV" != 'live' ] &&
  [ "$BUILD_ENV" != 'staging' ] &&
  [ "$BUILD_ENV" != 'test' ] &&
  [ "$BUILD_ENV" != 'dev' ] &&
  [ "$BUILD_ENV" != 'local' ];
then
  echo "Not found a valid environment variable $BUILD_ENV"
  exit
fi

#----------- STEP II/VI - Update environment file -----------#
echo "#----------- STEP II/V - Update environment file -----------#"
ENV_FILE=${ENV_FILE:=.env}
# Check exists environment file
if [ ! -f "$ENV_FILE" ]; then
  echo "Not found a valid environment file $ENV_FILE"
  exit
fi

#----------- STEP III/VI - Stop & remove the container if exists -----------#
echo "#----------- STEP III/V - Stop & remove the container if exists -----------#"
# Get container name
eval "$(grep ^REACT_APP_APP_NAME= $ENV_FILE)"
# Get port
eval "$(grep ^PORT= $ENV_FILE)"

CID=$(docker ps -q -f status=running -f name=^/${REACT_APP_APP_NAME}$)
if [ "${CID}" ]; then
  echo "Removing $REACT_APP_APP_NAME..."
  docker stop $REACT_APP_APP_NAME && docker rm $REACT_APP_APP_NAME
fi

#----------- STEP IV/VI - Go to root directory -----------#
echo "#----------- STEP IV/V - Go to root directory -----------#"
cd .

# Update NODE_ENV variable
sed -i -e "s/^NODE_ENV.*/NODE_ENV=$BUILD_ENV/" $ENV_FILE

# See $ENV_FILE
cat $ENV_FILE
echo ""

# Export container name and port
export REACT_APP_APP_NAME=$REACT_APP_APP_NAME
export REACT_APP_APP_PORT=$PORT

#----------- STEP V/V - Run the container $REACT_APP_APP_NAME -----------#
echo "#----------- STEP V/V - Run the container $REACT_APP_APP_NAME -----------#"
docker-compose -f docker-compose-prod.yml up -d --build
docker ps | grep "$REACT_APP_APP_NAME"

# Unset contaner name and port
unset REACT_APP_APP_NAME
unset REACT_APP_APP_PORT

echo "#----------- DONE -----------#"