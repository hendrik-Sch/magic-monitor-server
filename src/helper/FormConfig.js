const { readFile, writeFile } = require('fs/promises');
const path = require('path');
const { NUMBER, INTEGER, DATE, DATEONLY, TEXT, BOOLEAN } = require('sequelize');

const Config = require('../../config/config.json');
const Logger = require('../logger');
const { PrepareDirectorySync } = require('./prepareDirectory');
const GetSafePath = require('./getSafePath');

const DATA_DIR = Config.documents.data;
const FORM_CONFIG_DIR = "formConfig";
const MODELS_DIR = "models";
const CUSTOM_DIR = "custom";

const MODELS_PATH = path.resolve(DATA_DIR, FORM_CONFIG_DIR, MODELS_DIR);
const CUSTOM_PATH = path.resolve(DATA_DIR, FORM_CONFIG_DIR, CUSTOM_DIR);

PrepareDirectorySync(MODELS_PATH);
PrepareDirectorySync(CUSTOM_PATH);

class FormConfigHelper {
    static timestamps = ["createdAt", "updatedAt", "deletedAt"];

    static async save(formConfig, formConfigLocation) {
        try {
            const content = JSON.stringify(formConfig, null, 4);
            await writeFile(formConfigLocation, content);

            return true;
        } catch (error) {
            Logger.error(`Failed to save form config at "${formConfigLocation}": ${error.message}`);

            return false;
        }
    }

    static getFormTypeByModelType(modelType) {
        if (modelType instanceof NUMBER) {

            return "number";
        }

        if (modelType instanceof INTEGER) {

            return "integer";
        }

        if (modelType instanceof BOOLEAN) {

            return "boolean";
        }

        return "string";
    }

    static guessWidgetByColumnDef(columnDef) {
        if (columnDef.references) {

            return "ModelAutoComplete";
        }

        if (columnDef.type instanceof DATE) {

            return "date-time";
        }

        if (columnDef.type instanceof DATEONLY) {

            return "date";
        }

        if (columnDef.type instanceof TEXT) {

            return "textarea";
        }

        if (String(columnDef.fieldName).includes("email")) {

            return "email";
        }

        if (String(columnDef.fieldName).includes("url")) {

            return "uri";
        }

        return null;
    }

    static generate(model) {
        const required = [];
        const schema = {};
        const uiSchema = {
            "ui:order": []
        };

        for (const column in model.rawAttributes) {
            if (Object.hasOwnProperty.call(model.rawAttributes, column)) {
                if (this.timestamps.includes(column)) {
                    continue;
                }

                const columnDef = model.rawAttributes[column];
                if (!columnDef.allowNull && !columnDef.primaryKey) {
                    required.push(column);
                }

                schema[column] = {
                    title: column,
                    type: this.getFormTypeByModelType(columnDef.type),
                    default: columnDef.defaultValue
                };
                uiSchema[column] = {
                    size: {
                        xs: 12,
                        sm: 6
                    }
                };

                uiSchema[column]['ui:disabled'] = Boolean(columnDef.primaryKey);

                const widget = this.guessWidgetByColumnDef(columnDef);
                if (widget) {
                    uiSchema[column]['ui:widget'] = widget;
                    if (columnDef.references) {
                        uiSchema[column]['ui:options'] = {
                            model: columnDef.references.model
                        };
                    }
                }

                uiSchema['ui:order'].push(column);
            }
        }

        return {
            schema: {
                required,
                title: model.name,
                type: 'object',
                properties: schema
            },
            uiSchema
        };
    }

    static async getFormConfig(model, customFormConfig) {
        if (customFormConfig) {
            try {

                return await this.getCustomFormConfig(customFormConfig);
            } catch (error) {
                Logger.warn(error.message);
            }
        }

        const fileName = `${model.name}.json`;
        const formConfigLocation = path.resolve(MODELS_PATH, fileName);

        try {
            const formConfig = await readFile(formConfigLocation, { encoding: 'utf8' });

            return formConfig;
        } catch (error) {
            const formConfig = this.generate(model);
            this.save(formConfig, formConfigLocation);

            return formConfig;
        }
    }

    static async getCustomFormConfig(name) {
        try {
            const fileName = `${name}.json`;
            const formConfigLocation = GetSafePath(CUSTOM_PATH, fileName);
            const formConfig = await readFile(formConfigLocation, { encoding: 'utf8' });

            return formConfig;

        } catch (error) {
            throw new Error(`Failed to load custom form config "${name}": ${error.message}`);
        }
    }
}

module.exports = FormConfigHelper;