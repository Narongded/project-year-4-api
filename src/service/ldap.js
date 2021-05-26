process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import ldapjs from 'ldapjs'
import dotenv from 'dotenv'
dotenv.config();

const loginLdap = (upn, password) => new Promise(async (resolve, reject) => {
    const client = await ldapjs.createClient({ url: process.env.LDAP_URL, base: process.env.BASEDN });
    const searchOptions = { filter: `(&(sAMAccountName=${upn}))`, scope: "sub" }
    await client.bind(`${upn}@it.kmitl.ac.th`, password, (error) => {
        if (error) {
            reject(error)
            client.destroy(err => {
                console.error("error: " + err);
            })
        }
    });
    await client.search(process.env.BASEDN, searchOptions, (error, res) => {
        let data = {}
        if (error) {
            reject(error)
            client.destroy(err => {
                console.error("error: " + err);
            })
        }
        res.on("searchEntry", (entry) => {
            data = entry.object
        })
        res.on("error", function (err) {
            client.destroy(err => {
                console.error("error: " + err);
            })
        });
        res.on("end", function (result) {
            resolve(data)
            client.unbind(callback => {
                console.error("error: " + callback);
            })
        });
    })
})
export { loginLdap }