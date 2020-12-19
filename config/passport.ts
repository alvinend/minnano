import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from 'models/User'
import { keys } from 'config/keys'
import { PassportStatic } from 'passport'


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
}

export const passportConfig = (passport:PassportStatic) => {
  console.log('ccctesttest')
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
