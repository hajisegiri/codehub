import { LightningElement, wire, track} from 'lwc';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Phone', fieldName: 'Phone' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue' }, 
    { label: 'Industry', fieldName: 'Industry' }      
];

export default class AccountList extends LightningElement {
    @track page = 1; //this will initialize 1st page
    @track items = []; //it contains all the records.
    @track data = []; //data to be displayed in the table
    @track columns; //holds column info.
    @track startingRecord = 1; //start record position per page
    @track endingRecord = 0; //end record position per page
    @track pageSize = 10; //default value we are assigning
    @track totalRecords = 0; //total record count received from all retrieved records
    @track totalPage = 0; //total number of page is needed to display all records

    @wire(getAccountList)
    wiredAccounts({data, error}) {
        if (data) {
            this.items = data;
            this.totalRecords = data.length;
            this.totalPage = Math.ceil(this.totalRecords / this.pageSize);

            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = columns;

            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    //Fire events based on the button actions  
    handlePrevious() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    handleNext() {
        if((this.page < this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

    handleFirst() {
        this.page = 1;
        this.displayRecordPerPage(this.page);
    }
    
    handleLast() {
        this.page = this.totalPage;
        this.displayRecordPerPage(this.page);
    }

    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecords) 
                            ? this.totalRecords : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);

        this.startingRecord = this.startingRecord + 1;
    }    
        
}