import passport from 'passport';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken'
import con from '../manage/connectdb.js'
import Cryptr from 'cryptr'
import dotenv from 'dotenv'
import { loginLdap, searchData } from '../service/ldap.js'
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
dotenv.config();
export const adminAuth = () => {
    const jwtOptions = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'itkmitl'
    };
    const jwtAuth = new JWTStrategy(jwtOptions, async (payload, done) => {
        const decrype = new Cryptr('secretepassword');
        const password = decrype.decrypt(payload.password)
        loginLdap(payload.email, password).then((result) => {
            console.log(result)
            done(null, true);
        }).catch((err) => {
            console.log(err)
            done(null, false)
        })
    });
    passport.use(jwtAuth)
    return passport.authenticate("jwt", { session: false })
}
export const permit = (role) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split('Bearer ')[1]
            const userRole = jwt.verify(token, 'your_jwt_secret', {
                ignoreExpiration: false,
            });
            if (role.includes(userRole.role)) next();
            else {
                res.status(400).send('Unpermission')
            }
        } catch (error) {
            res.status(401).send('Unauthorized')
        }
    }
}