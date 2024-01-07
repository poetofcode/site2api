class ProjectEntityProvider {

    constructor(context) {
        this.context = context;

        this.code = {
           name: "NewProject",
           baseUrl: "misc.com" 
        }
    }


    async provideCreateEntityBody() {
        return {
            title: "Новый проект",
            code: this.code
        };
    }

    async provideEditEntityBody(entityId) {
        const found = (await this.context.apiGet(`/projects/${entityId}`)).data.result;
        return {
            title: "Ред. проект",
            code: {
                name: found.name,
                baseUrl: found.baseUrl
            }
        };
    }

    async prepareEntityBodyAndSave(entityBody, action) {
        const fullRes = await this.context.apiPost(`/projects/`, entityBody);
        const response = fullRes.data.result;
        response.redirect = `/console/projects/${response.result._id}`;
        return response;
    }

}

exports.ProjectEntityProvider = ProjectEntityProvider;