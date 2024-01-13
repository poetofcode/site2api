class EndpointEntityProvider {

    constructor(context) {
        this.context = context;

        this.code = {
            url: "sample",
            snippets: [],
            method: "get",
            create_snippet: true
        }

        this.snippet = {
            code: "// TODO"
        }
    }


    async provideCreateEntityBody() {
        return {
            title: "Новый эндпоинт",
            code: this.code
        };
    }

    async provideEditEntityBody(entityId) {
        const found = (await this.context.apiGet(`/endpoints/${entityId}`)).data.result;
        return {
            title: "Ред. эндпоинт",
            code: {
                url: found.url,
                snippets: found.snippets,
                method: found.method
            }
        }
    }

    async prepareEntityBodyAndSave(entityBody, query) {
        const action = query.action;
        const entityId = query.id;
        const projectId = query.project;
        let fullRes;
        let response;
        switch(action) {
          case 'add':
            let snippetRes = await this.context.apiPost(`/snippets`, this.snippet);
            const snippetId = snippetRes.data._id;
            console.log(snippetId);

            console.log(entityBody);

        
            const entityJson = JSON.parse(entityBody);
            console.log(entityJson);
            
            const snippets = entityJson.snippets;
            snippets.push(snippetId);

            const endpoint = {
                url: entityJson.url,
                method: entityJson.method,
                snippets: snippets
            }
            fullRes = await this.context.apiPost(`/projects/${projectId}/endpoints`, endpoint);
            response = fullRes.data.result;

            response.redirect = `/console/projects/${projectId}#${response._id}`;
            return response;

          // case 'edit':
          //   fullRes = await this.context.apiPatch(`/projects/${entityId}`, entityBody);
          //   response = fullRes.data.result;
          //   response.redirect = `/console/projects/${entityId}`;
          //   return response;
        }

        throw new Error(`Not found '${action}' action`)
    }

}

exports.EndpointEntityProvider = EndpointEntityProvider;