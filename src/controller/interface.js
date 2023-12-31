const EventEmitter = require("events");
const _ = require('lodash');

const GetInterfaces = require("../runCommand/getInterfaces");
const GetInterfacesState = require("../runCommand/getInterfacesState");
const StopInterface = require("../runCommand/stopInterface");
const StartInterface = require("../runCommand/startInterface");

const Watcher = require('../watcher/programms');
const Logger = require("../logger");

let interfaces = [];

class InterfaceController {
    static watcher = Watcher;

    static async loadInterfaces() {
        Logger.debug(`Started loading interfaces`);

        try {
            const prevInterfaces = _.cloneDeep(interfaces);

            const allInterfacesProm = GetInterfaces();
            const interfacesStateProm = GetInterfacesState();
            const [allInterfaces, interfacesState] = await Promise.all([allInterfacesProm, interfacesStateProm]);

            interfaces = [];
            for (const name in allInterfaces) {
                if (Object.hasOwnProperty.call(allInterfaces, name)) {
                    const { idle = false, running = false } = interfacesState[name] || {};

                    interfaces.push({
                        ...allInterfaces[name],
                        name,
                        idle,
                        running,
                        stopRequested: false,
                        startRequested: false
                    });
                }
            }
            interfaces = _.sortBy(interfaces, ['name']);
            if (!_.isEqual(interfaces, prevInterfaces)) {
                this.watcher.emit(`interfaces:change`);
            }
        } catch (error) {
            Logger.error(`Failed to load interfaces.`);
        }

        Logger.debug(`Finished loading interfaces`);
    }

    static getInterfaces() {

        return interfaces;
    }

    static async stopInterface(name) {
        try {
            const intf = interfaces.find(item => item.name === name);

            if (!intf) {
                Logger.error(`Failed to stop interface "${name}". Its not registered.`);

                return;
            }

            await StopInterface(intf);
        } catch (error) {
            Logger.error(`Failed to stop ${name}.`);
        }
    }

    static async startInterface(name) {
        try {
            const intf = interfaces.find(item => item.name === name);

            if (!intf) {
                Logger.error(`Failed to start interface "${name}". Its not registered.`);

                return;
            }

            await StartInterface(intf);
        } catch (error) {
            Logger.error(`Failed to start ${name}.`);
        }
    }
}

InterfaceController.watcher.on(`programms:change`, async () => {
    await InterfaceController.loadInterfaces();
    // InterfaceController.watcher.emit(`interfaces:change`);
});

module.exports = InterfaceController;