export function formatCambodiaPhone(phone:string) {
    let cleaned = phone.replace(/\s+/g,"");

    if (cleaned.startsWith("0")) {
        cleaned = cleaned.slice(1);
    }

    if (cleaned.startsWith("+855")) {
        return cleaned;
    }

    return `+855${cleaned}`
}