class DbExportEntityProvider {

    constructor(context, token) {
        this.context = context;
        this.token = token;
    }


    async provideCreateEntityBody() {
        const found = (await this.context.apiGet(`/backupdb`, this.token)).data.result;
        const downloadBackup = this.makeLink("/console/download_backup", "Скачать бэкап") 
        return {
            title: "DbExport/Import",
            code: found,
            extra: "<span>Это последний бэкап базы данных</span>" /* + '&nbsp;&nbsp;' + downloadBackup */
        };
    }

    async provideEditEntityBody(entityId) {
        const makeBackup = this.makeLink("#", "Сделать бэкап", "modern-button", "height: 30px; padding: 7px 20px") 
        const openBackup = this.makeLink("/console/edit?entity=dbexport&action=view", "Открыть последний бэкап") 
        const downloadBackup = this.makeLink("/console/download_backup", "Скачать бэкап") 
        const found = (await this.context.apiGet(`/exportdb`, this.token)).data.result;
        return {
            title: "DbExport/Import",
            code: found,
            extra: /*makeBackup + '&nbsp;&nbsp;' +*/ openBackup /* + '&nbsp;&nbsp;' + downloadBackup */
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