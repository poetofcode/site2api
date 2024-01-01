class ProjectEntityProvider {

    constructor(context) {
        this.context = context;
    }


    async provideCreateEntityBody() {

        return {
            title: "Новый проект",
            code: "{ 'sample' : 'Sample Project Body' }"
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