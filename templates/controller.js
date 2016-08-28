'use strict'
angular
    .module('FileMetadata', ['ngRoute','ngFileUpload'])
    
    .config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'index.html',
            controller: 'fileCtrl', 
            controllerAs: 'file',
        })
    
    })
    
    .controller('fileCtrl', fileController)
      
      
     function fileController($http, Upload){
         var fileForm = this
     fileForm.fileData = "File Data will display here"
     fileForm.submit = submit
     fileForm.upload = upload
      
      function submit(file) {
      if (file) {
        fileForm.upload(file)
        }
      }
       
      function upload(file) {
        Upload.upload({
            url: '/upload',
            data: {file: file }
        }).then(function (resp) {
            //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data)
            fileForm.fileData = JSON.stringify(resp.data)
        }, function (resp) {
            //console.log('Error status: ' + resp.status)
        }, function (evt) {
            fileForm.uploadProgress = ''+parseInt(100.0 * evt.loaded / evt.total)+'%'
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name)
        })
      }
     } 