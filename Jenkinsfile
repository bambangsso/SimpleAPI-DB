pipeline {
  agent any

  stages {

    stage('Upload application to staging') {
      steps {
	sh 'ssh jenkins@10.140.0.22 "rm -fR SimpleAPI-DB && mkdir SimpleAPI-DB"'
	sh 'scp -r . jenkins@10.140.0.22:/home/jenkins/SimpleAPI-DB'
	sh 'ssh jenkins@10.140.0.22 "cd /home/jenkins/SimpleAPI-DB && rm -fR DOCKER_DB && cp ./DOCKER_APP/* . && rm -fR DOCKER_APP"'
      }
    }

    stage('Dockerizing application') {
      steps {
	sh 'ssh jenkins@10.140.0.22 "cd /home/jenkins/SimpleAPI-DB && ./build-docker-app.sh SimpleAPI-DB"'
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