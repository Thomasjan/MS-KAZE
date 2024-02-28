
export const formatedDate = (date: Date) => {
    var tzoffset = (new Date(date)).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime;
}