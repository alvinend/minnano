import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from 'models/User'
import { PassportStatic } from 'passport'


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret'
}

export const passportConfig = (passport:PassportStatic) => {
  passport.use(
    new Strategy(opts, (jwtPayload, done) => {
      User.findById(jwtPayload.id)
        .then(user => {
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch(err => console.log(err))
    })
  )
}
