let API = {

    serverURL: "http://localhost:8080/api",
    request: (options,cb) =>{

        //håndter headers på options argument
        let headers = {};
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
            success: (data, status, xhr) => {
                cb(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr:xhr, status: status, error: errorThrown});
            }
        });
    },
    Orders:{
        getAll: (cb) => {
            API.request({method:"GET" , url: "/staff/getOrders", headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}},cb);
        },
        makeReady: (id,data, cb) => {
            API.request({method:"POST", url: "/staff/makeReady/"+id, data: data, headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}},cb)
        },
        getByUserId: (cb) => {
            API.request({method:"GET",
                url: "/user/getOrdersById/"+ API.Storage.load("user_id"),
                headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}},
                (err, data) => {
                    if (err) return cb(err);

                    cb(null, data);
                })
        },
        create: (items, cb) => {
            API.request({
                method:"POST",
                url: "/user/createOrder",
                data:
                    {
                        User_userId: API.Storage.load("user_id"),
                        items: items
                    },
                headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}},
                (err, data) => {
                    if (err) return cb(err);

                    cb(null, data);
                })
    }},
    Items:{
        getAll: (cb) => {
            API.request({
                method:"GET",
                url: "/user/getItems",
                headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}},
                (err, data) => {
                    if (err) return cb(err);

                    cb(null, data);
        })
    }},
    Users:{
        create:(username, password, cb) => {
            API.request({
                method:"POST",
                url:"/user/createUser",
                data:{username:username,password:password},
                headers:{Authorization: "Bearer " + API.Storage.load("BearerToken")}}
                ,cb);
        }
    },
    logOut: (cb) => {
        this.request({
            method:"POST",
            url:"/start/logout",
            headers: {
                Authorization: 'Bearer ' + API.Storage.load("BearerToken")
            },
            data:{
                "user_id": API.Storage.load("user_id")
            }}, (err, data) => {
            if (err) return cb(err);

            API.Storage.remove("BearerToken");
            API.Storage.remove("isPersonel");
            API.Storage.remove("user_id");

            cb(null, data);
            })

    },
    login: (username, password, cb) => {
     API.request({
         method:"POST",
         url: "/start/login",
         data: {
             username:username,
             password:password
         }
     }, (err, data) => {
         if (err) return cb(err);

         API.Storage.persist("BearerToken", data.token);
         API.Storage.persist("user_id", data.user_id);
         API.Storage.persist("isPersonel", data.isPersonel);

         cb(null, data);
     })
    },
    Storage: {
        persist: (key, value) => {
            window.localStorage.setItem(key, (typeof value === 'object') ? JSON.stringify(value) : value)
        },
        load: (key) => {
            let val = window.localStorage.getItem(key);
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

encryptXOR = (toBeEncrypted) => {
    const key = ['Y','O','L','O'];
    let isEncrypted= "";
    for (let i=0; i < toBeEncrypted.length ; i++){
        isEncrypted += (String.fromCharCode((toBeEncrypted.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0)))
    }
    return isEncrypted
};
