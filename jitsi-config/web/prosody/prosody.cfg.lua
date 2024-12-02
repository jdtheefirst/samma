admins = { "focus@auth.test.worldsamma.org" }
modules_enabled = {
    "bosh"; -- Enable BOSH
    "pubsub";
    "ping"; -- Keep-alive mechanism
    "auth_token"; -- JWT Authentication
}

authentication = "internal_hashed" -- Secure authentication
