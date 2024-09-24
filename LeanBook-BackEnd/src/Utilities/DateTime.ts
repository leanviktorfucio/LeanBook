import moment from "moment";

export const DateTime = {
    getNowAsDate: () => {
        return moment.utc().toDate();
    }
}