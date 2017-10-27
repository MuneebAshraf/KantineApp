var API = {

    serverURL: "http://localhost:8080/api",

    request: function(options,cb){

        //håndter headers på options argument
        var headers = {};
        if (options.headers) {
            Object.keys(options.headers).forEach(function (h) {
                headers[h] = (typeof options.headers[h] === 'object') ? JSON.stringify(options.headers[h]) : options.headers[h];
            });
        }

        //perform XHR
        $.ajax({
            url:API.serverURL + options.url,
            method:options.method,
            headers: headers,
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
            API.request({method:"GET" , url: "/staff/getOrders", headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}},cb);
        },
        makeReady: function (id,data, cb) {
            API.request({method:"POST", url: "/staff/makeReady/"+id, data: data, headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}},cb)
        },
        getByUserId:function (id, cb) {
            API.request({method:"GET" , url: "/user/getOrdersById/"+id, headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}},cb)
        },
        create: function (data, cb) {
            API.request({method:"POST", url: "/user/createOrder", data:data, headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}},cb)
        }
    },
    Items:{
        getAll: function (cb) {
            API.request({
                method:"GET",
                url: "/user/getItems",
                headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}},
                function (err, data) {
                    if (err) return cb(err);

                    cb(null, data);
        })
    }},
    Users:{
        create:function (username, password, cb) {
            API.request({
                method:"POST",
                url:"/user/createUser",
                data:{username:username,password:password},
                headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}}
                ,cb);
        }
    },
    logOut: function (cb) {
        this.request({
            method:"POST",
            url:"/start/logout",
            headers: {
                Authorization: 'Bearer ' + API.Storage.load("BearerToken")
            },
            data:{
                "user_id": API.Storage.load("user_id")
            }}, function (err, data) {
            if (err) return cb(err);

            cb(null, data);

        API.Storage.remove("BearerToken");
        API.Storage.remove("isPersonel");
        API.Storage.remove("user_id");
        })
    },
    login: function (username, password, cb) {
     this.request({
         method:"POST",
         url: "/start/login",
         data: {
             username:username,
             password:password
         }
     }, function (err, data) {
         if (err) return cb(err);

         API.Storage.persist("BearerToken", data.token);
         API.Storage.persist("user_id", data.user_id);
         API.Storage.persist("isPersonel", data.isPersonel);

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
