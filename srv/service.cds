using { Northdata as ext } from './external/Northdata';

service CatalogService{
    entity Employee as projection on ext.Employees ;
}