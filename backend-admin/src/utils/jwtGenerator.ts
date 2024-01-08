import jwt from 'jsonwebtoken'

export const createToken = (id:number)=>{

    return jwt.sign({ _id: id }, process.env.SECRET, { expiresIn: "3d" });
}