angular.module('myApp.factory', []).
factory('globalFunction', function(){
  return {
    setMessage: function(message, statut) {
      var messages = document.querySelector('.messages');
      messages.className = 'messages';
      switch(statut) {
        case 'warning':
          messages.classList.add('warning');
        break;
        case 'success':
          messages.classList.add('success');
        break;
      }
      messages.textContent = message;
      setTimeout(function(){
        messages.textContent = '';
      }, 2000);
    }
  };
});