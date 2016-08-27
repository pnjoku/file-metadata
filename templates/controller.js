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
         var file = this;
     file.fileData = "File Data will display here"
     file.submit = submit;
     file.upload = upload;
      
      function submit(file) {
      if (file) {
        file.upload(file)
        }
      }
       
      function upload(file) {
        Upload.upload({
            url: '/upload',
            data: {file: file }
        }).then(function (resp) {
            //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data)
            file.fileData = JSON.stringify(resp.data)
        }, function (resp) {
            //console.log('Error status: ' + resp.status)
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total)
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name)
        })
      }
     } 