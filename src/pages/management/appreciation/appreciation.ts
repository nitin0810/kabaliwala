import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { CustomService } from '../../../providers/custom.service';
import { AppreciationService } from '../../../providers/appreciation.service';

@IonicPage()
@Component({
    templateUrl: './appreciation.html'

})

export class AppreciationsPage {

    appreciationList: Array<any>;
    pageNo: number = 1;

    constructor(
        private customService: CustomService,
        private appreciationService: AppreciationService
    ) {
        this.getAppreciations();
    }

    onRoleChanged(ev: any) {
        this.pageNo = 1;
        this.getAppreciations();
    }

    getAppreciations(refresher?: any) {

        if (!refresher) { this.customService.showLoader(); }
        this.appreciationService.getAppreciations(1)
            .subscribe((res: any) => {

                this.appreciationList = res;
                refresher ? refresher.complete() : this.customService.hideLoader();
            }, (err: any) => {

                refresher ? refresher.complete() : this.customService.hideLoader();
                this.customService.showToast(err.msg);
            });
    }

    doRefresh(refresher: any) {
        this.getAppreciations(refresher);
    }

    doInfinite(refresher: any) {

        this.appreciationService.getAppreciations(this.pageNo + 1)
            .subscribe((res: any) => {

                if (res && res.length != 0) {
                    this.appreciationList = this.appreciationList.concat(res);
                    this.pageNo++;
                }
                refresher.complete();
            }, (err: any) => {

                refresher.complete();
                this.customService.showToast(err.msg);
            });
    }

}