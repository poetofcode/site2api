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
        console.log(`provideEditEntityBody: ${entityId}`);

        return "TO-DO: get project edit body";
    }

    async prepareEntityBodyAndSave(entityBody, action) {
        const fullRes = await this.context.apiPost(`/projects/`, entityBody);
        const response = fullRes.data.result;
        response.redirect = `/console/projects/${response.result._id}`;
        return response;
    }

}

exports.ProjectEntityProvider = ProjectEntityProvider;