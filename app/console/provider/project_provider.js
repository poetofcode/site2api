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

        return "TO-DO: get project edit body";
    }

    async prepareEntityBodyAndSave(entityBody) {
        const fullRes = await this.context.apiPost(`/projects/`, entityBody);
        return fullRes.data.result;
    }

}

exports.ProjectEntityProvider = ProjectEntityProvider;