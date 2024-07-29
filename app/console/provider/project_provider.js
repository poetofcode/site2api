class ProjectEntityProvider {

    constructor(context, token) {
        this.context = context;
        this.token = token;

        this.code = {
           name: "NewProject",
           baseUrl: "misc",
           params: {
            "url": "https://misc.com"
           }
        }
    }


    async provideCreateEntityBody() {
        return {
            title: "Новый проект",
            code: this.code
        };
    }

    async provideEditEntityBody(entityId) {
        const found = (await this.context.apiGet(`/projects/${entityId}`, this.token)).data.result;
        return {
            title: "Ред. проект",
            code: {
                name: found.name,
                baseUrl: found.baseUrl,
                params: found.params
            }
        };
    }

    async prepareEntityBodyAndSave(entityBody, query) {
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
    }

}

exports.ProjectEntityProvider = ProjectEntityProvider;