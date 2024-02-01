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
        const makeBackup = this.makeLink("#", "Сделать бэкап", "modern-button", "height: 30px; padding: 7px 20px") 
        const openBackup = this.makeLink("/console/edit?entity=exportdb&action=view", "Открыть бэкап") 
        const downloadBackup = this.makeLink("/console/download_backup", "Скачать бэкап") 
        const found = (await this.context.apiGet(`/exportdb`, this.token)).data.result;
        return {
            title: "DbExport/Import",
            code: found,
            extra: makeBackup + '&nbsp;&nbsp;' + openBackup + '&nbsp;&nbsp;' + downloadBackup
        };
    }

    async prepareEntityBodyAndSave(entityBody, query) {
        const action = query.action;
        // const entityId = query.id;
        let fullRes;
        let response;
        switch(action) {
          case 'edit':
            fullRes = await this.context.apiPost(`/importdb`, entityBody, this.token);
            response = fullRes.data.result;
            // response.redirect = `/console/projects/${entityId}`;
            return response;
        }

        throw new Error(`Not found '${action}' action`)
    }

    makeLink(href, text, clazz, styles) {
        return `<a class="${clazz}" href="${href}" style="${styles}">${text}</a>`
    }

}

exports.DbExportEntityProvider = DbExportEntityProvider;