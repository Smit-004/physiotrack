// "YYYY-MM-DD" user ke local time me (toISOString UTC deta hai, isliye use mat karna)
export const todayLocal = () => new Date().toLocaleDateString("en-CA");