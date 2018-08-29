window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:3000');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) { html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        }
    });
 
    sendButton.onclick = function() {
            var text = field.value;
            socket.emit('send', {message: text});
    }
}