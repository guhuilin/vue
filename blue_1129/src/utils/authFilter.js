import store from '@/store'

export function hasPerm(type) {
    let myPermissions = store.getters.controlPermissionList;
    if (myPermissions) {
        return myPermissions.indexOf(type) > -1;
    } else {
        return false;
    }
}
