
import { defineStore } from 'pinia'
import { ServeCaseDetail, ServeCaseRecordList, ServeCaseInformationList, ServeCaseSignList, ServeCaseComponentSave, ServeCaseBalanceOrder, ServeCaseSupervise, ServeCaseClose, ServeCaseTransferBack, ServeCaseRefund, ServeCaseTransferDetail, ServeCaseTransferComponentSave, ServeCaseOrderItems } from '@/api/user';

export const useCaseDetailStore = defineStore('case-detail', {
    state: () => {
        return {
            recordTip: "加载中...",
            informationTip: "加载中...",
            visible: false,
            type: 0,
            informationVisible: false,
            informationReload: false,
            paymentVisible: false,
            detailReload: false,
            superviseVisible: false,
            closeVisible: false,
            refundVisible: false,
            orderReload: false,
            informationOperateType: "add",
            detail: {} as any,
            transferDetail: {} as any,
            signList: [] as any,
            orderItems: [] as any,
            recordList: [] as any,
            informationList: [] as any,

        }
    },
    getters: {},
    actions: {
        setVisible(e) {
            this.visible = e
        },
        setInformationVisible(e) {
            this.informationVisible = e
        },
        setPaymentVisible(e, t) {
            this.paymentVisible = e
            this.type = t
        },
        setSuperviseVisible(e) {
            this.superviseVisible = e
        },
        setCloseVisible(e) {
            this.closeVisible = e
        },
        setRefundVisible(e) {
            this.refundVisible = e
        },
        setOrderReload(e) {
            this.orderReload = e
        },
        async getDetail(gid) {
            const res = await ServeCaseDetail({gid})
            if (res.code === 200) { 
                this.detail = res.data;
            }
        },
        async getTransferDetail(id) {
            const res = await ServeCaseTransferDetail({enterprise_case_id: id})
            if (res.code === 200) { 
                this.transferDetail = res.data;
            }
        },
        async getSignList(code) {
            const res = await ServeCaseSignList({code})
            if (res.code === 200) {
                this.signList = res.data.records;
            }
        },
        async getOrderItems(code) {
            const res = await ServeCaseOrderItems({code})
            if (res.code === 200) {
                this.orderItems = res.data.records;
            }
        },
        async getRecordList(code) {
            const res = await ServeCaseRecordList({code})
            if (res.code === 200) {
                this.recordList = res.data.records;
                if (res.data.records.length === 0) {
                    this.recordTip = "暂无数据"
                }
            }
        },
        async getInformationList(data) {
            const res = await ServeCaseInformationList(data)
            if (res.code === 200) {
                this.informationList = res.data.records;
                if (res.data.records.length === 0) {
                    this.informationTip = "暂无数据"
                }
            }
        },
        async getFollowList(data) {
            const res = await ServeCaseInformationList({...data, type: 2})
            if (res.code === 200) {
                this.informationList = res.data.records;
                if (res.data.records.length === 0) {
                    this.informationTip = "暂无数据"
                }
            }
        },
        async caseComponentSave(e) {
            const res = await ServeCaseComponentSave(e)
            if (res.code === 200) {
                this.informationReload = true
                this.informationVisible = false
                window['$message'].success("提交成功")
            } else {
                window['$message'].error(res.message);
            }
        },
        async caseTransferComponentSave(e) {
            const res = await ServeCaseTransferComponentSave(e)
            if (res.code === 200) {
                this.informationReload = true
                this.informationVisible = false
                window['$message'].success("提交成功")
            } else {
                window['$message'].error(res.message);
            }
        },
        async caseBalanceOrderSave(e) {
            const res = await ServeCaseBalanceOrder(e)
            if (res.code === 200) {
                this.paymentVisible = false
                window['$message'].success("提交成功")
            } else {
                window['$message'].error(res.message);
            }
        },
        async caseSuperviseSave(e) {
            const res = await ServeCaseSupervise(e)
            if (res.code === 200) {
                this.visible = false
                this.superviseVisible = false
                this.detailReload = true
                window['$message'].success("提交成功")
            } else {
                window['$message'].error(res.message);
            }
        },
        async caseCloseSave(e) {
            const res = await ServeCaseClose(e)
            if (res.code === 200) {
                this.visible = false
                this.closeVisible = false
                this.detailReload = true
                window['$message'].success("提交成功")
            } else {
                window['$message'].error(res.message);
            }
        },
        async caseCaseTransferBack(e) {
            const res = await ServeCaseTransferBack(e)
            if (res.code === 200) {
                this.visible = false
                this.detailReload = true
                window['$message'].success("提交成功")
            } else {
                window['$message'].error(res.message);
            }
        },
        async caseCaseRefund(e) {
            const res = await ServeCaseRefund(e)
            if (res.code === 200) {
                this.visible = false
                this.detailReload = true
                window['$message'].success("提交成功")
            } else {
                window['$message'].error(res.message);
            }
        }
    }
})