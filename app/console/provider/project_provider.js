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



        return {};
    }

}

exports.ProjectEntityProvider = ProjectEntityProvider;