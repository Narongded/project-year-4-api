

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
    });
    await client.search(process.env.BASEDN, searchOptions, (error, res) => {
        let data = {}
        if (error) {
            reject(error)
            client.unbind()
            client.destroy()
        }
        res.on("searchEntry", (entry) => {
            data = entry.object
        })
        res.on("error", function (err) {
            console.error("error: " + err.message);
        });
        res.on("end", function (result) {
            resolve(data)
            client.unbind()
            client.destroy()
        });
    })
})
export { loginLdap }