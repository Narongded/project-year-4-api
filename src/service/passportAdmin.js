import passport from 'passport';
import passportJWT from 'passport-jwt';
import jwt from 'jsonwebtoken'
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
import dotenv from 'dotenv'
dotenv.config();
export const adminAuth = () => {

    const jwtOptions = {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret'
    };
    const jwtAuth = new JWTStrategy(jwtOptions, async (payload, done) => {
        await modeluser.find({ username: payload.username, uid: payload.uid }, (err, doc) => {

            // Can delete && payload.username !== process.env.MASTER_USER
            if ((doc.length === 0 || err) && payload.username !== process.env.MASTER_USER) done(null, false)
            else done(null, true);
        })
    });
    passport.use(jwtAuth);
    return passport.authenticate("jwt", { session: false });
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
            res.status(400).send('Unauthorized')
        }
    }
}