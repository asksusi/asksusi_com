(function(){
  
  var chat = {
    messageToSend: '',
    templateResponse: Handlebars.compile( $("#message-response-template").html()),
    init: function() {
      this.cacheDOM();
      this.bindEvents();
      this.render();
    },
    cacheDOM: function() {
      this.$chatHistory = $('.chat-history');
      this.$button = $('button');
      this.$textarea = $('#message-to-send');
      this.$chatHistoryList =  this.$chatHistory.find('ul');
    },
    bindEvents: function() {
      this.$button.on('click', this.addMessage.bind(this));
      this.$textarea.on('keyup', this.addMessageEnter.bind(this));
    },
    render: function() {
      this.scrollToBottom();
      if (this.messageToSend.trim() !== '') {
        var template = Handlebars.compile( $("#message-template").html());
        var context = { 
          messageOutput: this.messageToSend,
          time: this.getCurrentTime()
        };

        this.$chatHistoryList.append(template(context));
        this.scrollToBottom();
        this.$textarea.val('');
        
        // responses
        var query = this.messageToSend.trim();
        this.getSusiResponse(query);
      }
      
    },
    addMessage: function() {
      this.messageToSend = this.$textarea.val()
      this.render();         
    },
    addMessageEnter: function(event) {
        // enter was pressed
        if (event.keyCode === 13) {
          if (event.shiftKey) { //enter + shift
            $(this).val( $(this.target).val() + "\n" );
          } else {
            this.addMessage();
          }
        }
    },
    scrollToBottom: function() {
       this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
    },
    getCurrentTime: function() {
        return new Date().toLocaleTimeString().
                replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    processSusiData: function(data) {
      var replacedText = data.answers[0].actions[0].expression;
      var replacePattern1, replacePattern2, replacePattern3;
      var tableData = data.answers[0].data;
      var index = 0;
      var mapType = false;
      var lat, lng;
      var SpecialResponseChoice = data.answers[0].actions.length;
      if (SpecialResponseChoice >= 2) {
        if(data.answers[0].actions[1].type == "table") {
          replacedText += "<ol style='list-style-type:decimal'>";
          for (index = 0; index < tableData.length; index++) {
            var tableTitle = tableData[index].title;
            replacedText += "<li>" +tableTitle + "</li>";
          }
          replacedText += "</ol>";
        }
      }

      if (tableData[0].hasOwnProperty('lat') || tableData[0].hasOwnProperty('lon')) {
        // Need to give out a map.
        mapType = true;
        lat = tableData[0]['lat'];
        lng = tableData[0]['lon'];
      }

      //URLs starting with http://, https://, or ftp://
      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      replacedText = replacedText.replace(replacePattern1, '<a href="$1" target="_blank">Click Here!</a>');

      //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$3$</a>');

      //Change email addresses to mailto:: links.
      replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
      replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$3$</a>');

      var contextResponse = { 
        response: replacedText,
        time: this.getCurrentTime(),
        lat: lat,
        lng: lng,
        TheUniqueIDForTime: new Date().getTime()
      };

      this.$chatHistoryList.append(this.templateResponse(contextResponse));
      if (SpecialResponseChoice >= 2) {
        if (data.answers[0].actions[1].type == "piechart") {
          this.drawGraph(data);
        }
      }
      if (mapType == true) {
        this.drawMap(lat, lng, contextResponse.TheUniqueIDForTime);
      }
      this.scrollToBottom();
    },
    susiapipath: '/susi/chat.json?callback=p&q=',
    localhost:'http://127.0.0.1:4000',
    remotehost:'http://api.asksusi.com',
    getSusiResponse: function(queryString) {
      var _super = this;
      $.ajax({
        url: (window.location.protocol == 'file:' ? _super.remotehost : _super.remotehost) + _super.susiapipath + encodeURIComponent(queryString),
        dataType: 'jsonp',
        jsonpCallback: 'p',
        jsonp: 'callback',
        crossDomain: true,
        async: false,
        timeout: window.location.protocol == 'file:' ? 1000 : 10000,
        success: function (data) {
          _super.processSusiData(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
          $.ajax({
            url: _super.remotehost + _super.susiapipath + encodeURIComponent(queryString),
            dataType: 'jsonp',
            jsonpCallback: 'p',
            jsonp: 'callback',
            crossDomain: true,
            async: false,
            success: function (data) {
              data.answers[0].actions[0].expression = '* ' + data.answers[0].actions[0].expression
              _super.processSusiData(data);
            }
          });
        } 
      });
    },
    drawMap: function(lat, lng, time) {
      var idGen = 'mapid-'+lat+'-'+lng+'-'+time;
      var mymap = L.map(idGen).setView([lat, lng], 13);

      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoib3JiaXRlciIsImEiOiJjajAyODk4d24wN2RvMndwM3Fwb28yZHhvIn0.s5T089Va4dztDLevo9iXXA', {
        maxZoom: 18,
        attribution: '',
        id: 'mapbox.streets'
      }).addTo(mymap);
      L.marker([lat, lng]).addTo(mymap)
        .bindPopup("<b>Hello!</b><br />I'm Here.").openPopup();
    },

    drawGraph: function(data) {

    var dataElements = [];
    for (var element = 0; element < data.answers[0].data.length; element++) {
      var elementObject = {};
      elementObject['y'] = data.answers[0].data[element].percent;
      elementObject['name'] = data.answers[0].data[element].president;
      dataElements.push(elementObject);
    }
    $('#container-graph').highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer'
        }
      },
      series: [{
        name: 'Presidents',
        colorByPoint: true,
        data: dataElements
      }]
    });
      }
  };

  
  chat.init();
  
  var searchFilter = {
    options: { valueNames: ['name'] },
    init: function() {
      var userList = new List('people-list', this.options);
      var noItems = $('<li id="no-items-found">No items found</li>');
      
      userList.on('updated', function(list) {
        if (list.matchingItems.length === 0) {
          $(list.list).append(noItems);
        } else {
          noItems.detach();
        }
      });
    }
  };
  
  searchFilter.init();
  
})();
