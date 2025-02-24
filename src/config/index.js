import { connect } from "mongoose";
import mongoose from "mongoose";


export const connectDb = async () => {
    try {
        console.log('base de datos conectadas')
        await mongoose.connect('mongodb+srv://galvanfacundo004:Facugoten05@codercluster.dx1rh.mongodb.net/c82641?retryWrites=true&w=majority&appName=CoderCluster')

    } catch (error) {
        console.log(error)
    }

}