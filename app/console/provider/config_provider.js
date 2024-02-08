class ConfigEntityProvider {

    constructor(context, token) {
        this.context = context;
        this.token = token;
    }


    async provideCreateEntityBody() {
        return {
            title: "Нстройки",
            code: "Action 'view' not implemented"
        };
    }

    async provideEditEntityBody(entityId) {
        const found = (await this.context.apiGet(`/config`, this.token)).data.result;
        return {
            title: "Настройки",
            code: found
        };
    }

    async prepareEntityBodyAndSave(entityBody, query) {
        /*
        const action = query.action;
        const entityId = query.id;
        let fullRes;
        let response;
        switch(action) {
          case 'add':
            fullRes = await this.context.apiPost(`/projects/`, entityBody, this.token);
            response = fullRes.data.result;
            response.redirect = `/console/projects/${response.result._id}`;
            return response;

          case 'edit':
            fullRes = await this.context.apiPatch(`/projects/${entityId}`, entityBody, this.token);
            response = fullRes.data.result;
            response.redirect = `/console/projects/${entityId}`;
            return response;
        }

        throw new Error(`Not found '${action}' action`)
        */
    }

}

exports.ConfigEntityProvider = ConfigEntityProvider;