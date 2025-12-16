export function toLocalCambodiaPhone(phone:string) {
    if (!phone) {
        return "";
    }

    if (phone.startsWith("+855")) {
        return "0" + phone.slice(4)
    }

}