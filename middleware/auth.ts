import jwt from 'jsonwebtoken'
import config from 'config'
import { IUser } from 'models/User'

export default (req: any, res: any, next: any) => {
  const token = req.header('x-auth-token')

  if (!token) {
    return res.status(401).json({ msg: 'No token, auth denied' })
  }

  try {
    const decoded = jwt.verify(
      token,
      config.get('jwtSecret')
    ) as any

    req.user = decoded.user as IUser
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token not valid' })
  }
}
