import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'addressFormatt' })

export class AddressFormatt implements PipeTransform {
    constructor() { }

    transform(event: any):any {
        let HTML = '' ;
        if(event){
            if(event.location){
                HTML = `<span>${event.location}, </span>\n<br/>`  
            }
            if(event.street1){
                HTML +=  `<span>${event.street1}, </span>\n`  
            }
            if(event.street2){
                HTML +=  `<span>${event.street2}, </span>\n<br/>`  
            }
            if(event.city){
                HTML +=  `<span>${event.city}, </span>\n`  
            }
            if(event.state){
                HTML +=  `<span>${event.state}, </span>\n`  
            }
            if(event.zipPin){
                HTML +=  `<span>${event.zipPin}.</span>\n`  
            }
        }

        return HTML;
    }
}