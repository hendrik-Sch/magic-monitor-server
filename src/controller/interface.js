const EventEmitter = require("events");
const _ = require('lodash');

const GetInterfaces = require("../runCommand/getInterfaces");
const GetInterfacesState = require("../runCommand/getInterfacesState");
const StopInterface = require("../runCommand/stopInterface");
const StartInterface = require("../runCommand/startInterface");

const Watcher = require('../watcher/programms');
const Logger = require("../logger");

let interfaces = [
    // {
    //     "name": "SAP_INFOR_HCM_ALUKON",
    //     "idle": true,
    //     "running": true,
    //     "stopRequested": true,
    //     "startRequested": false
    // },
    // {
    //     "name": "VIADAT_SAP_HOCHREGAL_AST",
    //     "idle": false,
    //     "running": false,
    //     "stopRequested": false,
    //     "startRequested": true
    // },
    // {
    //     "name": "SAP_VIADAT_HOCHREGAL_AST",
    //     "idle": true,
    //     "running": false,
    //     "stopRequested": false,
    //     "startRequested": false
    // },
    // {
    //     "name": "SST 4",
    //     "idle": true,
    //     "running": false,
    //     "stopRequested": false,
    //     "startRequested": false
    // },
    // {
    //     "name": "SST 5",
    //     "idle": false,
    //     "running": false,
    //     "stopRequested": false,
    //     "startRequested": false
    // },
    // {
    //     "name": "SST 6",
    //     "idle": true,
    //     "running": true,
    //     "stopRequested": false,
    //     "startRequested": false
    // },
    // {
    //     "name": "SST 7",
    //     "idle": true,
    //     "running": false,
    //     "stopRequested": false,
    //     "startRequested": false
    // },
    // {
    //     "name": "SST 8",
    //     "idle": false,
    //     "running": false,
    //     "stopRequested": false,
    //     "startRequested": false
    // },
    // {
    //     "name": "SST 9",
    //     "idle": true,
    //     "running": true,
    //     "stopRequested": false,
    //     "startRequested": false
    // },
    // {
    //     "name": "SST 10",
    //     "idle": true,
    //     "running": false,
    //     "stopRequested": false,
    //     "startRequested": false
    // }
];

class InterfaceController {
    static watcher = Watcher;

    static async loadInterfaces() {
        const allInterfacesProm = GetInterfaces();
        const interfacesStateProm = GetInterfacesState();

        const prevInterfaces = _.cloneDeep(interfaces);

        const [allInterfaces, interfacesState] = await Promise.all([allInterfacesProm, interfacesStateProm]);

        interfaces = [];
        for (const name in allInterfaces) {
            if (Object.hasOwnProperty.call(allInterfaces, name)) {
                const { location } = allInterfaces[name];
                const { idle = false, running = false } = interfacesState[name] || {};

                interfaces.push({
                    name,
                    location,
                    idle,
                    running,
                    stopRequested: false,
                    startRequested: false
                });
            }
        }
        interfaces = _.sortBy(interfaces, ['name']);
        if (!_.isEqual(interfaces, prevInterfaces)) {
            this.watcher.emit(`programms:change`);
        }
    }

    static getInterfaces() {

        return interfaces;
    }

    static async stopInterface(name) {
        const intf = interfaces.find(item => item.name === name);

        if (!intf) {
            Logger.error(`Failed to stop interface "${name}". Its not registered.`)
        }

        await StopInterface(intf);
    }

    static async startInterface(name) {
        const intf = interfaces.find(item => item.name === name);

        if (!intf) {
            Logger.error(`Failed to start interface "${name}". Its not registered.`)
        }

        await StartInterface(intf);
    }
}

InterfaceController.watcher.on(`programms:change`, async () => {
    await InterfaceController.loadInterfaces();
    InterfaceController.watcher.emit(`interfaces:change`);
});

module.exports = InterfaceController;