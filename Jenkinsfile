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



  }

}