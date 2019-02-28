  fetchPrivateAppData: function(item, pageNo) {    
    var method = 'GET';
    var requestURL = apiEndPoint + '/' + item ;    
    var oauth_signature_method = 'RSA-SHA1';
    var oauth_timestamp = (new Date().getTime()/1000).toFixed();
    var oauth_nonce = generateRandomString(Math.floor(Math.random() * 50));
    var oauth_version = '1.0';     
    var signBase = 'GET' + '&' + encodeURIComponent(requestURL) + '&'
    + encodeURIComponent('oauth_consumer_key=' + this.consumerKey + '&oauth_nonce=' + oauth_nonce + '&oauth_signature_method='
                         + oauth_signature_method + '&oauth_timestamp=' + oauth_timestamp + '&oauth_token=' + this.consumerKey + '&oauth_version='
                         + oauth_version + '&page=' + pageNo);  
 
/********where I will get PEM_KEY key to get the values.*******/

var PEM_KEY = '-----BEGIN RSA PRIVATE KEY-----' +
'...' +
'-----END RSA PRIVATE KEY-----';


    var rsakeyval = new RSAKey();   
      rsakeyval.readPrivateKeyFromPEMString(PEM);     

      var sbSigned = rsakeyval.signString(signBase, 'sha1');    


    var data = new Array();
   for (var i =0; i < sbSigned.length; i += 2) 
     data.push(parseInt("0x" + sbSigned.substr(i, 2)));  
      
    var oauth_signature = hex2b64(sbSigned);  

    var authHeader = "OAuth oauth_token=\"" + this.consumerKey + "\",oauth_nonce=\"" + oauth_nonce + "\",oauth_consumer_key=\"" + this.consumerKey 
    + "\",oauth_signature_method=\"RSA-SHA1\",oauth_timestamp=\"" + oauth_timestamp + "\",oauth_version=\"1.0\",oauth_signature=\""  
    + encodeURIComponent(oauth_signature) + "\"";    

    var headers = { "User-Agent": this.userAgent, "Authorization": authHeader, "Accept": "application/json"};    
    var options = { muteHttpExceptions: true, "headers": headers}; 
    
    
    var response = UrlFetchApp.fetch(requestURL + '?page=' + pageNo, options);
    
    if (response.getResponseCode() == 200)
      return JSON.parse(response.getContentText());    
    else
      return false;
  },
