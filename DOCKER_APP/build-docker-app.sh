if [ $# -ne 1 ]; then
   echo "Usage: ./build-docker-app.sh <docker name>"
   exit 1
fi

DOCKER_REPO_NAME=`echo $1 | awk '{print tolower($0)}'`
APP_PORT=`grep App_Port Conf.Staging.json | awk -F':' '{print $2}'`

APP_PORT=`echo $APP_PORT`
if [[ $APP_PORT = *[[:digit:]]* ]]; then
   echo "Found application port $APP_PORT, building docker"
   sudo docker build --build-arg APP_PORT=$APP_PORT  -t $DOCKER_REPO_NAME .
   sudo docker run -p $APP_PORT:$APP_PORT $DOCKER_REPO_NAME
else
   echo "Application port is not found, you need to define on the Conf.Staging.json file. Docker build terminated"
fi