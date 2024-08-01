using { Northdata as ext } from './external/Northdata';
using  {logging as ext1}   from './external/logging';

service CatalogService{
    entity Employee as projection on ext.Employees ;
    entity Territory as projection on ext.Territories ;
    entity Logger as projection on ext1.Logger ;
}