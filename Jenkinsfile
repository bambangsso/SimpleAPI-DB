pipeline {
  agent any

  stages {

    stage('Listing local and remote directory') {
      steps {
        sh 'ls -la'
	sh 'ssh jenkins@10.140.0.27 "ls -la"'
	sh 'ssh jenkins@10.140.0.22 "ls -la"'
	sh 'ssh jenkins@10.140.0.21 "ls -la"'
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