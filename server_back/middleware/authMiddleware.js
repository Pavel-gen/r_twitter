import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const secret = process.env.secret



const authMiddleware = (req, res, next) => {
    if(req.method == 'OPTIONS'){
        next()
    }
    try{
        const token = req.headers.authorization.split(" ")[1]
        if (!token){
            return res.status(400).json({message: 'Пользватель не авторизован'})
        }
        const decodedData = jwt.verify(token, secret)
        req.user = decodedData
        next()
    } catch(e){
        return res.status(400).json({message: 'Пользватель не авторизован'})
    }
}

export default authMiddleware