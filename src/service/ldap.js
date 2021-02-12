

import ldapjs from 'ldapjs'
import dotenv from 'dotenv'

dotenv.config();
const client = ldapjs.createClient({ url: process.env.LDAP_URL, base: process.env.BASEDN });
const loginLdap = (upn, password) => {
    client.bind(`${upn}@it.kmitl.ac.th`, password, (error) => {
        if (error) {
            throw error;
        }
        else console.log('Authenticated successfully');
    });
}
const searchData = (upn, password) => new Promise((resolve, reject) => {
    const searchOptions = { filter: `(&(sAMAccountName=${upn}))`, scope: "sub" }
    client.bind(`${upn}@it.kmitl.ac.th`, password, (error) => {
        if (error) {
            reject(error)
        }
        else console.log('Authenticated successfully');
    });
    client.search("DC=it,DC=kmitl,DC=ac,DC=th", searchOptions, (error, res) => {
        if (error) {
            reject(error)
        }
        res.on("searchEntry", (entry) => {
            resolve(entry.object)
        });
    });
})
export  { loginLdap, searchData }