MySQL_PORT=`grep MySQL_Port Conf.Staging.json | awk -F':' '{print $2}'`
Redis_PORT=`grep Redis_Port Conf.Staging.json | awk -F':' '{print $2}'`
MongoDB_PORT=`grep MongoDB_Port Conf.Staging.json | awk -F':' '{print $2}'`

MySQL_PORT=`echo $MySQL_PORT | sed 's/[^0-9]*//g'`
Redis_PORT=`echo $Redis_PORT | sed 's/[^0-9]*//g'`
MongoDB_PORT=`echo $MongoDB_PORT | sed 's/[^0-9]*//g'`

if [[ $MySQL_PORT = *[[:digit:]]* ]] && [[ $Redis_PORT = *[[:digit:]]* ]] && [[ $MongoDB_PORT = *[[:digit:]]* ]]; then
   echo "Found database port $MySQL_PORT $Redis_PORT $MongoDB_PORT, building docker"
   echo "MySQL_PORT=$MySQL_PORT" > .env
   echo "Redis_PORT=$Redis_PORT" >> .env
   echo "MongoDB_PORT=$MongoDB_PORT" >> .env
   sudo docker-compose up -d
else
   echo "Database port is not found, you need to define on the Conf.Staging.json file. Docker build terminated"
fi