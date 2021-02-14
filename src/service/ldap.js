

import ldapjs from 'ldapjs'
import dotenv from 'dotenv'
dotenv.config();

const loginLdap = (upn, password) => new Promise(async (resolve, reject) => {
    const client = await ldapjs.createClient({ url: process.env.LDAP_URL, base: process.env.BASEDN });
    const searchOptions = { filter: `(&(sAMAccountName=${upn}))`, scope: "sub" }
    await client.bind(`${upn}@it.kmitl.ac.th`, password, (error) => {
        if (error) {
            reject(error)
            client.unbind()
            client.destroy()
        }
        else console.log('Authenticated successfully');
    });
    await client.search("DC=it,DC=kmitl,DC=ac,DC=th", searchOptions, (error, res) => {
        if (error) {
            reject(error)
            client.unbind()
            client.destroy()
        }
        else res.on("searchEntry", (entry) => {
            resolve(entry.object)
            client.unbind()
            client.destroy()
        });
    });
})
export { loginLdap }