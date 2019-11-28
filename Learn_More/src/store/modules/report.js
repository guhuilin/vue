import { getAllReportDomainInfoList,  getAllReportBusinessInfoList, getAllReportTypeInfoList } from '@api/api'

const report = {
    state: {
        reportArea: [],
        reportBusiness: [],
        reportType: []
    },
    mutations: {
    
    },
    actions: {
        getReportArea({commit}) {
            return new Promise((resolve, reject) => {
                getAllReportDomainInfoList({}).then(res => {
                    if (res.success) {
                        resolve(res.result);
                    } else {
                        resolve();
                    }
                });
            })
        },
        getReportBusiness({commit},reportdomainId) {
            return new Promise((resolve, reject) => {
                getAllReportBusinessInfoList({reportdomainId}).then(res => {
                    if (res.success) {
                        resolve(res.result);
                    } else {
                        resolve();
                    }
                });
            })
        },
        getReportType({commit}) {
            return new Promise((resolve, reject) => {
                getAllReportTypeInfoList({}).then(res => {
                    if (res.success) {
                        resolve(res.result);
                    } else {
                        resolve();
                    }
                });
            })
        },
    }
};


export default report