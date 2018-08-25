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
        sh 'scp -r nginx*staging.conf jenkins@10.140.0.27:/etc/nginx/conf.d/staging.bjtech.io.conf.d'
        sh 'ssh jenkins@10.140.0.27 "ls -la /etc/nginx/conf.d/staging.bjtech.io.conf.d"'
      }
    }



  }

}