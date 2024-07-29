const cds = require('@sap/cds');

class CatalogService extends cds.ApplicationService {

    async init( ){

        const { Employee } = this.entities ;

        this.on( 'READ' , Employee , async(req) => {

            let NorthWindConnect = await cds.connect.to("Northdata");

            let response = await NorthWindConnect.tx(req).run(req.query);


            response.$count = response.value.length;

            return response.value ;

        });


        await super.init();
    }

    
}

module.exports = { CatalogService };