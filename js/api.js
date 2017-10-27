var API = {

    serverURL: "http://localhost:8080/api",

    request: function(options,cb){

        //perform XHR
        $.ajax({
            url:API.serverURL + options.url,
            method:options.method,
            contentType: "application/json",
            dataType:"json",
            data: JSON.stringify(options.data),
            success:function (data, status, xhr) {
                cb(null, data, status, xhr);
            },
            error: function (xhr, status, errorThrown) {
                cb({xhr:xhr, status: status, error: errorThrown});
            }
        });
    },
    Orders:{
        getAll: function (cb) {
            API.request({method:"GET" , url: "/staff/getOrders", headers:{authorization: "bearer " + API.Storage.load("BearerToken")}},cb);
        },
        makeReady: function (id,data, cb) {
            API.request({method:"POST", url: "/staff/makeReady/"+id, data: data, headers:{authorization: "bearer " + API.Storage.load("BearerToken")}},cb)
        },
        getByUserId:function (id, cb) {
            API.request({method:"GET" , url: "/user/getOrdersById/"+id, headers:{authorization: "bearer " + API.Storage.load("BearerToken")}},cb)
        },
        create: function (data, cb) {
            API.request({method:"POST", url: "/user/createOrder", data:data, headers:{authorization:"bearer " + API.Storage.load("BearerToken")}},cb)
        }
    },
    Items:{
        getAll: function (cb) {
            API.request({method:"GET", url: "/user/getItems", headers:{authorization: "bearer " + API.Storage.load("BearerToken")}},cb);
        }
    },
    Users:{
        create:function (username, password, cb) {
            API.request({method:"POST", url:"/user/createUser", data:{username:username,password:password}, headers:{authorization: "bearer " + API.Storage.load("BearerToken")}},cb);
        }
    },
    logOut: function (cb) {
        API.request({
            method:"POST",
            url:"/start/logout",
            headers: {
                'authorization': 'Bearer ' + API.Storage.load("BearerToken")
            },
            data:{
                "user_id": API.Storage.load("user_id")
            }},
            cb);
    },
    login: function (username, password, cb) {
     this.request({
         data: {
             username:username,
             password:password
         },
         url: "/start/login",
         method:"POST"
     }, function (err, data) {
         if (err) return cb(err);

         console.log(data)
         API.Storage.persist("BearerToken", data.token);
         API.Storage.persist("user_id", data.user_id);
         API.Storage.persist("isPersonel", data.isPersonel);
3
         cb(null, data);
     })
    },
    Storage: {
        persist: function (key, value) {
            window.localStorage.setItem(key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: function (key) {
            var val = window.localStorage.getItem(key);
            try {
                return JSON.parse(val);
            }
            catch (e) {
                return val;
            }
        },
        remove: function (key) {
            window.localStorage.removeItem(key)
        }
    }
};

function encryptXOR(toBeEncrypted) {
    var key = ['Y','O','L','O'];
    var isEncrypted= "";
    for (var i=0; i < toBeEncrypted.length ; i++){
        isEncrypted += (String.fromCharCode((toBeEncrypted.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0)))
    }
    return isEncrypted
}
