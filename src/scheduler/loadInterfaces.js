const InterfaceController = require("../controller/interface");

InterfaceController.loadInterfaces();
setInterval(() => {
    InterfaceController.loadInterfaces();
}, 20000);