const cds = require('@sap/cds');

class CatalogService extends cds.ApplicationService {

    async init( ){

        const { Employee , Territory } = this.entities ;

        this.on( 'READ' , Employee , async(req) => {

            let NorthWindConnect = await cds.connect.to("Northdata");
            let logConnect = await cds.connect.to("logging");
            let tx = logConnect.transaction(req);
            
            // first microservice call
            let response = await NorthWindConnect.tx(req).run(req.query);
            const headers = { "content-type" : "application/json"};

            // log the usage of employee from northwind
            let resp1 = await tx.send('POST', '/Logger' , {
                "entitysetname"    : "Employee",
                "externalendpoint" : "Northwind"
            } , headers );
            
            req.query.SELECT.from.ref[0] = 'CatalogService.Territory';
            
            req.query.SELECT.orderBy[0].ref[0] = "TerritoryID";

            //second microservice call
            let response2 = await NorthWindConnect.tx(req).run(req.query);

           for(let i = 0 ; i < response.value.length ; i++)
            {
                response.value[i].Address = response2.value[0].TerritoryDescription;
            }

            // log the usage of employee from northwind
            let resp2 = await tx.send('POST', '/Logger' , {
                "entitysetname"    : "Territories",
                "externalendpoint" : "Northwind"
            } , headers );


            response.$count = response.value.length;

            return response.value ;

        });


        await super.init();
    }

    
}

module.exports = { CatalogService };