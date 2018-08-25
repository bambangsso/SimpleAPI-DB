pipeline {
  agent any

  stages {

    stage('Upload application to staging') {
      steps {
	sh 'ssh jenkins@10.140.0.22 "rm -fR ${JOB_NAME} && mkdir ${JOB_NAME}"'
	sh 'scp -r . jenkins@10.140.0.22:/home/jenkins/${JOB_NAME}'
	sh 'ssh jenkins@10.140.0.22 "cd /home/jenkins/${JOB_NAME} && rm -fR DOCKER_DB && cp ./DOCKER_APP/* . && rm -fR DOCKER_APP"'
      }
    }

    stage('Dockerizing application') {
      steps {
	sh 'ssh jenkins@10.140.0.22 "cd /home/jenkins/${JOB_NAME} && ./build-docker-app.sh ${JOB_NAME}"'
      }
    }

    stage('Adding nginx webhook') {
      steps {
        sh 'scp -r nginx*staging.conf jenkins@10.140.0.27:/tmp'
        sh 'ssh jenkins@10.140.0.27 "sudo cp /tmp/nginx*staging.conf /etc/nginx/conf.d/staging.bjtech.io.conf.d && sudo ls -la /etc/nginx/conf.d/staging.bjtech.io.conf.d && rm -f /tmp/nginx*staging.conf"'
      }
    }

    stage('Restart nginx') {
      steps {
        sh 'ssh jenkins@10.140.0.27 "sudo service nginx restart"'
      }
    }



  }

}