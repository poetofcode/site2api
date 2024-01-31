class DbExportEntityProvider {

    constructor(context, token) {
        this.context = context;
        this.token = token;
    }


    async provideCreateEntityBody() {
        return {
            title: "DbExport/Import",
            code: "No found 'create' action"
        };
    }

    async provideEditEntityBody(entityId) {
        const found = (await this.context.apiGet(`/exportdb`, this.token)).data.result;
        return {
            title: "DbExport/Import",
            code: found,
            extra: "<a href=\"#\">Скачать резервный бэкап</a>"
        };
    }

    async prepareEntityBodyAndSave(entityBody, query) {
        // const action = query.action;
        // const entityId = query.id;
        // let fullRes;
        // let response;
        // switch(action) {
        //   case 'edit':
        //     fullRes = await this.context.apiPatch(`/projects/${entityId}`, entityBody, this.token);
        //     response = fullRes.data.result;
        //     response.redirect = `/console/projects/${entityId}`;
        //     return response;
        // }

        throw new Error(`Not found '${action}' action`)
    }

}

exports.DbExportEntityProvider = DbExportEntityProvider;