

import { Component, Input } from '@angular/core';
import { IonicPage, ModalController, Events, ToastController, NavController } from 'ionic-angular';
import { ComplaintService } from '../../../providers/complaint.service';
import { CustomService } from '../../../providers/custom.service';


@IonicPage()
@Component({
    selector: 'complaint-main',
    templateUrl: './complaint-main.html',
    styles: [` `]
})

export class ComplaintMainPage {

    @Input() complaintList: Array<any>;
    @Input() searchInput: string;

    statusIcons: any = {
        Satisfied: 'md-thumbs-up',
        Reopen: 'md-refresh',
        InProgress: 'md-code-download',
        Closed: 'md-remove-circle',
        Assigned: 'md-checkmark'
        // New status to be added
    }



    isEmptyList: boolean = false;
    currentPage: number = 1;
    currentPageWithSearch: number = 1;

    searchInProcess: boolean = false;
    isSortApplied: boolean = false;
    isFilterApplied: boolean = false;

    appliedSortName: string;
    appliedFilter: any;
    refreshMsgDisplayed: boolean = false;
    debounceDuration: number = 400;

    constructor(
        public mdlCtrl: ModalController,
        private navCtrl: NavController,
        private toastCtrl: ToastController,
        public complaintService: ComplaintService,
        public customService: CustomService,
        public events: Events
    ) {
        this.getComplaints(1);
    }


    onSortFilterSelect(event: any) {

        if (event.sortName) {

            if (event.sortName === 'clear') {
                this.doRefresh();
            } else {

                // if (this.isSortApplied || this.isFilterApplied) { this.currentPageWithSortFilter = 1; }

                this.customService.showLoader();
                this.complaintService.sortBy(event.sortName, 1)
                    .subscribe((res: any) => {

                        this.complaintList = res;
                        this.isEmptyList = this.complaintList.length == 0;
                        this.appliedSortName = event.sortName;
                        this.isSortApplied = true;
                        this.isFilterApplied = false;
                        this.searchInput = '';
                        this.customService.hideLoader();

                        this.currentPage = 1;
                        // this.showSortFilterRemoveMsg();

                    },
                        (err: any) => {

                            this.customService.hideLoader();
                            this.customService.showToast(err.msg);

                        });
            }
        }
        else if (event.filter) {

            if (event.filter.filterName === 'clear') {
                this.doRefresh();
            } else {

                this.customService.showLoader();
                this.complaintService.filterBy(event.filter.filterName, event.filter.id, 1)
                    .subscribe((res: any) => {

                        this.complaintList = res;
                        this.isEmptyList = this.complaintList.length == 0;
                        this.appliedFilter = event.filter;
                        this.isFilterApplied = true;
                        this.isSortApplied = false;
                        this.searchInput = '';
                        this.customService.hideLoader();
                        // this.showSortFilterRemoveMsg();
                        this.currentPage = 1;
                    },
                        (err: any) => {
                            this.customService.hideLoader();
                            this.customService.showToast(err.msg);

                        });
            }
        }
    }

    getComplaints(pageNo: number, refresher?: any) {

        if (!refresher) { this.customService.showLoader(); }

        this.complaintService.getComplaints(pageNo)
            .subscribe((res: any) => {

                this.complaintList = res;
                this.isEmptyList = this.complaintList.length == 0;
                refresher ? refresher.complete() : this.customService.hideLoader();

            },
                (err: any) => {

                    refresher ? refresher.complete() : this.customService.hideLoader();
                    this.customService.showToast(err.msg);

                });
    }

    // openNewComplaintModal() {

    //     let mod = this.mdlCtrl.create("NewComplaintPage");
    //     mod.present();

    //     mod.onDidDismiss((recentlyAddedComplaint?: any) => {

    //         if (recentlyAddedComplaint && recentlyAddedComplaint.data) {

    //             this.complaintList.unshift(recentlyAddedComplaint.data);
    //         }
    //     });
    // }

    openViewModal(complaint: any, index: number) {
        // complaint list and index are to be sent so that 
        // if complaint is edited from within the view
        // the same can be reflected in the list also
        this.navCtrl.push("ViewComplaintPage", { viewCompl: complaint, index: index, list: this.complaintList });
    }

    doRefresh(refresher?: any) {

        this.getComplaints(1, refresher);
        this.currentPage = 1;
        this.currentPageWithSearch = 1;
        this.isSortApplied = false;
        this.isFilterApplied = false;
        this.searchInput = '';
    }

    doInfinite(refresher: any) {

        if (this.searchInput.trim().length >= 1) {

            // if (!this.appliedFilter) {
            //     this.complaintService.search(this.searchInput, this.currentPageWithSearch + 1)
            //         .subscribe((res: any) => {

            //             if (!res) {
            //                 refresher.complete();
            //                 return;
            //             }
            //             this.complaintList = this.complaintList.concat(res);
            //             if (res.length != 0) { this.currentPageWithSearch++; }
            //             refresher.complete();

            //         }, (err: any) => {

            //             refresher.complete();
            //             this.customService.showToast(err.msg);

            //         });
            // } else {

            //     this.complaintService.searchAfterFilter(this.appliedFilter, this.searchInput, this.currentPageWithSearch + 1)
            //         .subscribe((res: any) => {

            //             if (!res) {
            //                 refresher.complete();
            //                 return;
            //             }
            //             this.complaintList = this.complaintList.concat(res);
            //             if (res.length != 0) { this.currentPageWithSearch++; }
            //             refresher.complete();

            //         }, (err: any) => {

            //             refresher.complete();
            //             this.customService.showToast(err.msg);

            //         });
            // }

        }
        else if (this.isSortApplied || this.isFilterApplied) {

            if (this.isSortApplied) {
                this.complaintService.sortBy(this.appliedSortName, this.currentPage + 1)
                    .subscribe((res: any) => {

                        refresher.complete();
                        if (res && res.length) {
                            this.currentPage++;
                            this.complaintList = this.complaintList.concat(res);
                        }

                    }, (err: any) => {

                        refresher.complete();
                        this.customService.showToast(err.msg);

                    });

            }

            else {
                this.complaintService.filterBy(this.appliedFilter.filterName, this.appliedFilter.id, this.currentPage + 1)
                    .subscribe((res: any) => {

                        if (res && res.length) {
                            this.currentPage++;
                            this.complaintList = this.complaintList.concat(res);
                        }
                        refresher.complete();

                    }, (err: any) => {

                        refresher.complete();
                        this.customService.showToast(err.msg);

                    });
            }
        }
        else {

            this.complaintService.getComplaints(this.currentPage + 1)
                .subscribe((res: any) => {

                    if (res.length != 0) {
                        this.complaintList = this.complaintList.concat(res);
                        this.currentPage++;
                    }
                    refresher.complete();
                },
                    (err: any) => {

                        refresher.complete();
                        this.customService.showToast(err.msg);

                    });
        }
    }

    onSearchInput(event: any) {

        /**Event type has been checked to remove a severe error: 
         * on clicking cross btn, the mouse event is also fired and ` if (this.searchInput.trim().length == 0)`
         * condition was becoming true, which was causing  double request to server.
         * Hence only input event is allowed 
         *  */
        if (event.type != 'input') { return; }

        if (this.searchInput.trim().length >= 1) {

            if (this.isFilterApplied) {

                this.sendSearchAfterFilterRequest();
            } else {
                this.sendSearchRequest();
            }
        }

        if (this.searchInput.trim().length == 0) {

            if (this.isFilterApplied) {
                console.log('FILTERED SEARCH FIRED--ON LENGTH 0 .......');
                this.onSortFilterSelect({ filter: this.appliedFilter });
            } else {
                console.log('NORMAL SEARCH FIRED--ON LENGTH 0 .......');
                this.getComplaints(1);
            }

        }
    }

    sendSearchRequest() {

        // this.searchInProcess = true;
        // this.currentPageWithSearch = 1;
        // this.complaintService.search(this.searchInput, this.currentPageWithSearch)
        //     .subscribe((res: any) => {

        //         this.complaintList = res;
        //         this.searchInProcess = false;
        //         this.isEmptyList = !this.complaintList || this.complaintList.length == 0;

        //         this.isSortApplied = false;
        //         this.isFilterApplied = false;
        //         this.currentPageWithSortFilter = 1;

        //     }, (err: any) => {

        //         console.log(err);
        //         this.customService.showToast(err.msg);
        //         this.searchInProcess = false;

        //     });
    }

    sendSearchAfterFilterRequest() {

        // this.currentPageWithSearch = 1;
        // this.searchInProcess = true;
        // this.complaintService.searchAfterFilter(this.appliedFilter, this.searchInput, this.currentPageWithSearch)
        //     .subscribe((res: any) => {

        //         this.complaintList = res;
        //         this.searchInProcess = false;
        //         this.isEmptyList = !this.complaintList || this.complaintList.length == 0;

        //     }, (err: any) => {

        //         this.customService.showToast(err.msg);
        //         this.searchInProcess = false;

        //     });
    }

    onSearchClear(event: any) {

        // if (this.isFilterApplied) {

        //     this.customService.showLoader();
        //     this.complaintService.filterBy(this.appliedFilter, 1)
        //         .subscribe((res: any) => {

        //             this.complaintList = res;
        //             this.isEmptyList = this.complaintList.length == 0;
        //             this.customService.hideLoader();
        //         },
        //             (err: any) => {
        //                 this.customService.hideLoader();
        //                 this.customService.showToast(err.msg);

        //             });
        // } else {
        //     this.getComplaints(1);

        // }
    }

    // showSortFilterRemoveMsg() {

    //     if (!this.refreshMsgDisplayed) {
    //         let toast = this.toastCtrl.create({
    //             message: "Pull down to refresh or remove any applied filter or sort",
    //             duration: 3000,
    //             position: "top"

    //         });
    //         toast.present();
    //         this.refreshMsgDisplayed = true;
    //     }
    // }


}
